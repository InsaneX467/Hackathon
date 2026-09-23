import os
import glob
import zipfile
import json
import pandas as pd
import numpy as np

# Safe Hugging Face datasets import demonstration & fallback verification
try:
    from datasets import load_dataset
    HF_DATASETS_AVAILABLE = True
except ImportError:
    HF_DATASETS_AVAILABLE = False
    load_dataset = None

DATASET_NAME = "DataUploader/IndLands"

def find_hf_cache_zips():
    """Locate HuggingFace cached zip archives for IndLands if local CSVs are missing."""
    hf_cache_pattern = os.path.expanduser(
        '~/.cache/huggingface/hub/datasets--DataUploader--IndLands/snapshots/*/*.zip'
    )
    return glob.glob(hf_cache_pattern)

def process_state_csv(csv_path, state_name, max_samples=120):
    """
    Process raw IndLands state CSV (32 remote sensing features)
    into structured GIS grid points and regional summary statistics.
    """
    df = None
    if os.path.exists(csv_path):
        print(f"Processing {state_name} from {csv_path}...")
        df = pd.read_csv(csv_path)
    else:
        # Fallback to HF cached zip archive if local CSV is missing
        zips = find_hf_cache_zips()
        for z_path in zips:
            if state_name.lower().replace(' ', '_') in os.path.basename(z_path).lower() or state_name.lower() in os.path.basename(z_path).lower():
                try:
                    with zipfile.ZipFile(z_path, 'r') as z:
                        for fname in z.namelist():
                            if fname.endswith('.csv') and ('dataset.csv' in fname or 'Pradesh_dataset.csv' in fname):
                                print(f"Processing {state_name} from zip entry {fname}...")
                                with z.open(fname) as f:
                                    df = pd.read_csv(f)
                                break
                except Exception as e:
                    print(f"Error reading zip for {state_name}: {e}")
                break

    if df is None:
        print(f"Data for {state_name} not found at {csv_path} or in HF cache.")
        return None

    # Filter valid coordinates & fill missing values to prevent NaN in JSON output
    df = df.dropna(subset=['latitude', 'longitude']).copy()
    
    # Fill NaN values in numerical columns with medians or 0 to keep JSON output strictly valid
    for col in ['slope', 'twi', 'tri', 'NDVI', 'NDWI', 'BSI', 'elevation', 'aspect', 'spi', 'GLCMCorrelation', 'Entropy', 'Contrast']:
        if col in df.columns:
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val if not pd.isna(median_val) else 0.0)

    # Select representative samples spatially to avoid cluttering map
    if len(df) > max_samples:
        indices = np.linspace(0, len(df) - 1, max_samples, dtype=int)
        sample_df = df.iloc[indices].copy()
    else:
        sample_df = df.copy()

    # Calculate Landslide Risk Index (LRI) using remote sensing & topographic features from IndLands
    # LRI = w1*slope_norm + w2*twi_norm + w3*tri_norm + w4*(1-ndvi_norm) + w5*bsi_norm
    slope_range = (sample_df['slope'].max() - sample_df['slope'].min()) + 1e-6
    twi_range = (sample_df['twi'].max() - sample_df['twi'].min()) + 1e-6
    tri_range = (sample_df['tri'].max() - sample_df['tri'].min()) + 1e-6
    ndvi_range = (sample_df['NDVI'].max() - sample_df['NDVI'].min()) + 1e-6
    bsi_range = (sample_df['BSI'].max() - sample_df['BSI'].min()) + 1e-6

    norm_slope = (sample_df['slope'] - sample_df['slope'].min()) / slope_range
    norm_twi = (sample_df['twi'] - sample_df['twi'].min()) / twi_range
    norm_tri = (sample_df['tri'] - sample_df['tri'].min()) / tri_range
    norm_ndvi = (sample_df['NDVI'] - sample_df['NDVI'].min()) / ndvi_range
    norm_bsi = (sample_df['BSI'] - sample_df['BSI'].min()) / bsi_range
    
    lri = (norm_slope * 0.35 + norm_twi * 0.25 + norm_tri * 0.15 + (1 - norm_ndvi) * 0.15 + norm_bsi * 0.10) * 100
    sample_df['landslide_risk_index'] = np.round(lri, 1)

    points = []
    for idx, row in sample_df.iterrows():
        pt = {
            "id": f"{state_name.lower().replace(' ', '_')}_{idx}",
            "lat": round(float(row['latitude']), 5),
            "lng": round(float(row['longitude']), 5),
            "elevation": round(float(row.get('elevation', 0.0)), 1),
            "slope": round(float(row.get('slope', 0.0)), 2),
            "aspect": round(float(row.get('aspect', 0.0)), 1),
            "ndvi": round(float(row.get('NDVI', 0.0)), 4),
            "ndwi": round(float(row.get('NDWI', 0.0)), 4),
            "twi": round(float(row.get('twi', 0.0)), 2),
            "tri": round(float(row.get('tri', 0.0)), 2),
            "spi": round(float(row.get('spi', 0.0)), 2),
            "bsi": round(float(row.get('BSI', 0.0)), 4),
            "glcm_correlation": round(float(row.get('GLCMCorrelation', 0.0)), 4),
            "glcm_entropy": round(float(row.get('Entropy', 0.0)), 4),
            "glcm_contrast": round(float(row.get('Contrast', 0.0)), 4),
            "riskScore": float(row['landslide_risk_index']),
            "riskCategory": "HIGH" if row['landslide_risk_index'] >= 70 else ("MEDIUM" if row['landslide_risk_index'] >= 40 else "LOW"),
            "state": state_name
        }
        points.append(pt)

    summary = {
        "state": state_name,
        "total_points_in_dataset": len(df),
        "sampled_points": len(points),
        "mean_slope": round(float(df['slope'].mean()), 2),
        "mean_elevation": round(float(df['elevation'].mean()), 1),
        "mean_ndvi": round(float(df['NDVI'].mean()), 4),
        "mean_twi": round(float(df['twi'].mean()), 2),
        "high_risk_count": int((lri >= 70).sum()),
        "medium_risk_count": int(((lri >= 40) & (lri < 70)).sum()),
        "low_risk_count": int((lri < 40).sum()),
        "points": points
    }

    return summary

def generate_full_indlands_data():
    """
    Generate structured IndLands dataset for web client and API server.
    """
    public_data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../public/data"))
    os.makedirs(public_data_dir, exist_ok=True)
    
    csv_files = {
        "Uttarakhand": os.path.join(public_data_dir, "indlands_uttarakhand.csv"),
        "Himachal Pradesh": os.path.join(public_data_dir, "indlands_himachal_pradesh.csv"),
        "Sikkim": os.path.join(public_data_dir, "indlands_sikkim.csv"),
        "Mizoram": os.path.join(public_data_dir, "indlands_mizoram.csv"),
        "Maharashtra": os.path.join(public_data_dir, "indlands_maharashtra.csv"),
        "Karnataka": os.path.join(public_data_dir, "indlands_karnataka.csv")
    }
    
    state_summaries = {}
    all_points = []
    
    for state_name, csv_path in csv_files.items():
        summary = process_state_csv(csv_path, state_name, max_samples=120)
        if summary:
            state_summaries[state_name] = summary
            all_points.extend(summary['points'])

    dataset_json = {
        "dataset_name": DATASET_NAME,
        "title": "IndLands: A Spatiotemporal dataset for region-aware landslide analysis from Multi-Source Remote Sensing Imagery",
        "huggingface_url": "https://huggingface.co/datasets/DataUploader/IndLands",
        "hf_datasets_installed": HF_DATASETS_AVAILABLE,
        "modalities": ["Sentinel-2 Multispectral Tiles", "DEM Elevation Models", "GLCM Texture Maps", "Spectral Indices", "Annotated Landslide Boundaries"],
        "feature_count": 32,
        "features": [
            "latitude", "longitude", "slope", "aspect", "elevation", "curvature", 
            "plan_curvature", "profile_curvature", "spi", "tri", "twi", "fdr",
            "NDVI", "NDWI", "SAVI", "EVI", "BSI", "ARVI", "GNDVI", "GRVI", "MSAVI", "NDTI", "mNDMI", "mNDWI",
            "ASM", "Contrast", "Dissimilarity", "Energy", "Entropy", "GLCMCorrelation", "GLCMMean", "Homogeneity"
        ],
        "states": list(state_summaries.keys()),
        "state_summaries": state_summaries,
        "total_points": len(all_points),
        "all_points": all_points
    }
    
    output_json_path = os.path.join(public_data_dir, "indlands_full.json")
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(dataset_json, f, indent=2)
    print(f"\n==========================================")
    print(f"Generated {output_json_path} successfully!")
    print(f"Total structured GIS remote-sensing points: {len(all_points)}")
    return dataset_json

if __name__ == "__main__":
    generate_full_indlands_data()
