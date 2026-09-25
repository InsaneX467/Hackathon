"""
preprocessing.py
----------------
Defines scikit-learn ColumnTransformer and Pipeline for end-to-end data preprocessing.
Implements scaling (StandardScaler), missing value imputation (SimpleImputer),
and categorical encoding (OneHotEncoder).
"""

from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
import pandas as pd
import numpy as np


def build_preprocessing_pipeline(numerical_features, categorical_features=None):
    """
    Constructs a ColumnTransformer with Pipeline stages for numerical and categorical features.

    Parameters:
    -----------
    numerical_features : list of str
        List of numerical feature names to scale and impute.
    categorical_features : list of str, optional
        List of categorical feature names to one-hot encode.

    Returns:
    --------
    ColumnTransformer
        Scikit-learn ColumnTransformer configured for pre-processing.
    """
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    transformers = [('num', num_pipeline, numerical_features)]

    if categorical_features and len(categorical_features) > 0:
        cat_pipeline = Pipeline([
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ])
        transformers.append(('cat', cat_pipeline, categorical_features))

    preprocessor = ColumnTransformer(transformers=transformers, remainder='drop')
    return preprocessor


if __name__ == "__main__":
    from ml.src.data_loader import load_indlands_data, NUMERICAL_FEATURES
    from ml.src.feature_engineering import LandslideFeatureEngineer
    
    df = load_indlands_data(sample_per_state=500)
    engineer = LandslideFeatureEngineer()
    df_feat = engineer.transform(df)

    engineered_cols = [
        'slope_elevation_ratio', 'wetness_moisture_index', 'vegetation_instability',
        'ruggedness_steepness_factor', 'soil_exposure_ratio', 'rainfall_slope_risk',
        'soil_saturation_twi_risk'
    ]
    all_num_cols = [c for c in NUMERICAL_FEATURES if c in df_feat.columns] + engineered_cols
    
    preprocessor = build_preprocessing_pipeline(numerical_features=all_num_cols)
    X_trans = preprocessor.fit_transform(df_feat)
    print("Preprocessed feature matrix shape:", X_trans.shape)
    print("Preprocessor successfully fitted!")
