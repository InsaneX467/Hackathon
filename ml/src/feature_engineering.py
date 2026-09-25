"""
feature_engineering.py
----------------------
Domain-specific feature engineering module for Landslide & Flash-Flood Disaster Risk.
Constructs terrain-vegetation-moisture interaction features and supports extension for dynamic IoT sensors.
Implemented as a scikit-learn compatible Transformer for pipeline serialization.
"""

import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin


class LandslideFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Scikit-learn compatible transformer that computes derived risk features
    from geospatial, topographical, and spectral features.
    Also injects dynamic IoT placeholders (rainfall, soil_moisture) if provided.
    """
    
    def __init__(self, include_iot=True):
        self.include_iot = include_iot
        
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        # Convert to DataFrame if NumPy array
        if isinstance(X, np.ndarray):
            # Fallback feature list if raw array passed
            from ml.src.data_loader import NUMERICAL_FEATURES
            cols = NUMERICAL_FEATURES[:X.shape[1]]
            df = pd.DataFrame(X, columns=cols)
        else:
            df = X.copy()

        # 1. Slope to Elevation Ratio (Steep high-altitude terrain risk)
        elevation = df.get('elevation', pd.Series(1000.0, index=df.index)).astype(float)
        slope = df.get('slope', pd.Series(10.0, index=df.index)).astype(float)
        df['slope_elevation_ratio'] = slope / (np.abs(elevation) + 100.0)

        # 2. Wetness-Moisture Index (Topographic Wetness * Moisture Index)
        twi = df.get('twi', pd.Series(3.0, index=df.index)).astype(float)
        mNDMI = df.get('mNDMI', pd.Series(0.0, index=df.index)).astype(float)
        df['wetness_moisture_index'] = twi * (mNDMI + 1.0)

        # 3. Vegetation Loss Instability (Low NDVI on steep slopes increases landslide risk)
        ndvi = df.get('NDVI', pd.Series(0.3, index=df.index)).astype(float)
        df['vegetation_instability'] = (1.0 - np.clip(ndvi, -1.0, 1.0)) * slope

        # 4. Terrain Ruggedness Steepness Factor (TRI * Slope)
        tri = df.get('tri', pd.Series(2.0, index=df.index)).astype(float)
        df['ruggedness_steepness_factor'] = tri * slope

        # 5. Bare Soil Index Water Ratio (BSI / (NDWI + 1.5))
        bsi = df.get('BSI', pd.Series(0.0, index=df.index)).astype(float)
        ndwi = df.get('NDWI', pd.Series(0.0, index=df.index)).astype(float)
        df['soil_exposure_ratio'] = bsi / (ndwi + 2.0)

        # 6. Dynamic IoT Feature Extension (if dynamic rainfall/soil moisture present)
        rainfall = df.get('rainfall', pd.Series(0.0, index=df.index)).astype(float)
        soil_moisture = df.get('soil_moisture', pd.Series(0.0, index=df.index)).astype(float)
        
        # Calculate rainfall and saturation interaction indicators
        df['rainfall_slope_risk'] = rainfall * slope
        df['soil_saturation_twi_risk'] = (soil_moisture / 100.0) * twi

        return df


def engineer_features(df):
    """Convenience helper function for DataFrame feature engineering."""
    engineer = LandslideFeatureEngineer()
    return engineer.transform(df)


if __name__ == "__main__":
    try:
        from data_loader import load_indlands_data
    except ImportError:
        from ml.src.data_loader import load_indlands_data
    df = load_indlands_data(sample_per_state=1000)
    df_engineered = engineer_features(df)
    print("Engineered DataFrame shape:", df_engineered.shape)
    new_cols = [c for c in df_engineered.columns if c not in df.columns]
    print("Engineered Features Added:", new_cols)
    print(df_engineered[new_cols].head())
