"""
data_loader.py
--------------
Module for loading, parsing, and inspecting Hugging Face dataset 'DataUploader/IndLands'.
Handles multi-state geospatial archives and extracts clean tabular features for landslide risk modeling.
"""

import os
import glob
import zipfile
import pandas as pd
import numpy as np
from datasets import load_dataset


DATASET_NAME = "DataUploader/IndLands"

# Core numerical features available across IndLands state tabular archives
NUMERICAL_FEATURES = [
    'latitude', 'longitude', 'elevation', 'slope', 'aspect', 'curvature',
    'plan_curvature', 'profile_curvature', 'fdr', 'spi', 'tri', 'twi',
    'NDVI', 'NDWI', 'SAVI', 'EVI', 'BSI', 'ARVI', 'GNDVI', 'GRVI', 'MSAVI',
    'NDTI', 'mNDMI', 'mNDWI', 'ASM', 'Contrast', 'Dissimilarity', 'Energy',
    'Entropy', 'GLCMCorrelation', 'GLCMMean', 'Homogeneity'
]

TARGET_COLUMN = 'Decision'

STATE_CSV_MAP = {
    'Himachal_Pradesh': 'Himachal_Pradesh/Himachal Pradesh_dataset.csv',
    'Uttarakhand': 'Uttarakhand/Uttarakhand_dataset.csv',
    'Maharashtra': 'Maharashtra/dataset.csv',
    'Karnataka': 'Karnataka/dataset.csv',
    'Sikkim': 'Sikkim/Sikkim_dataset.csv',
    'Mizoram': 'Mizoram/Mizoram_dataset.csv'
}


def find_hf_cache_zips():
    """Locate HuggingFace cached zip archives for IndLands."""
    hf_cache_pattern = os.path.expanduser(
        '~/.cache/huggingface/hub/datasets--DataUploader--IndLands/snapshots/*/*.zip'
    )
    zips = glob.glob(hf_cache_pattern)
    return zips


def load_indlands_data(states=None, sample_per_state=50000, random_state=42):
    """
    Loads and concatenates remote sensing tabular records from IndLands dataset.
    
    Parameters:
    -----------
    states : list of str, optional
        List of state names to include (e.g. ['Himachal_Pradesh', 'Uttarakhand', 'Maharashtra']).
    sample_per_state : int, optional
        Number of records to sample per state for balanced memory usage during model training.
    random_state : int
        Seed for sampling reproducibility.
        
    Returns:
    --------
    pd.DataFrame
        Combined DataFrame containing features and target column 'Decision'.
    """
    zips = find_hf_cache_zips()
    
    if not zips:
        print(f"Triggering Hugging Face download for {DATASET_NAME}...")
        try:
            load_dataset(DATASET_NAME)
            zips = find_hf_cache_zips()
        except Exception as e:
            print(f"Dataset load attempt note: {e}")
            zips = find_hf_cache_zips()

    if not zips:
        raise RuntimeError(
            f"Could not find cached dataset zip files for '{DATASET_NAME}'. "
            "Please ensure internet connectivity or pre-download the dataset."
        )

    dfs = []
    selected_states = states or list(STATE_CSV_MAP.keys())

    for state_name in selected_states:
        zip_path = None
        for z in zips:
            if state_name.lower() in os.path.basename(z).lower():
                zip_path = z
                break
                
        if not zip_path:
            print(f"Warning: Zip for state '{state_name}' not found. Skipping.")
            continue

        rel_csv = STATE_CSV_MAP.get(state_name)
        try:
            with zipfile.ZipFile(zip_path, 'r') as zfile:
                # Find matching csv inside zip
                target_csv = None
                for fname in zfile.namelist():
                    if fname.endswith('.csv') and ('dataset.csv' in fname or 'Pradesh_dataset.csv' in fname):
                        target_csv = fname
                        break
                if not target_csv:
                    for fname in zfile.namelist():
                        if fname.endswith('.csv') and 'post_event' in fname:
                            target_csv = fname
                            break

                if target_csv:
                    print(f"Loading '{state_name}' from {target_csv} inside {os.path.basename(zip_path)}...")
                    with zfile.open(target_csv) as f:
                        df_state = pd.read_csv(f)
                        df_state['state_origin'] = state_name
                        
                        # Verify target presence
                        if TARGET_COLUMN in df_state.columns:
                            # Drop any rows where target is NaN
                            df_state = df_state.dropna(subset=[TARGET_COLUMN])
                            # Sample if row count is large
                            if sample_per_state and len(df_state) > sample_per_state:
                                df_state = df_state.sample(n=sample_per_state, random_state=random_state)
                            dfs.append(df_state)
                            print(f"  Loaded {len(df_state)} samples from {state_name}.")
                        else:
                            print(f"  Warning: Target '{TARGET_COLUMN}' missing in {target_csv}.")
        except Exception as e:
            print(f"Error loading {state_name}: {e}")

    if not dfs:
        raise ValueError("No state data frames were loaded successfully.")

    full_df = pd.concat(dfs, ignore_index=True)
    print(f"\nSuccessfully loaded total {len(full_df)} records across {len(dfs)} states.")
    return full_df


def inspect_dataset(df):
    """
    Prints complete exploratory analysis report on the dataset.
    """
    print("\n" + "=" * 60)
    print("      INDLANDS EXPLORATORY DATA ANALYSIS REPORT")
    print("=" * 60)
    print(f"Total Rows      : {df.shape[0]}")
    print(f"Total Columns   : {df.shape[1]}")
    print(f"Column Names    :\n{list(df.columns)}")
    print("\nData Types Summary:")
    print(df.dtypes.value_counts())

    print(f"\nMissing Values (Top 10):")
    missing = df.isnull().sum()
    print(missing[missing > 0].nlargest(10))
    if missing.sum() == 0:
        print("  No missing values detected.")

    print(f"\nDuplicate Records: {df.duplicated().sum()}")

    if TARGET_COLUMN in df.columns:
        print(f"\nTarget Column '{TARGET_COLUMN}' Class Distribution:")
        val_counts = df[TARGET_COLUMN].value_counts()
        print(val_counts)
        print("Class Percentages:")
        print(df[TARGET_COLUMN].value_counts(normalize=True) * 100)

    print("\nNumerical Statistics (Sample Columns):")
    cols_to_stat = [c for c in ['elevation', 'slope', 'NDVI', 'twi', 'mNDMI'] if c in df.columns]
    print(df[cols_to_stat].describe().T[['mean', 'std', 'min', '50%', 'max']])
    print("=" * 60 + "\n")


if __name__ == "__main__":
    df = load_indlands_data(sample_per_state=20000)
    inspect_dataset(df)
