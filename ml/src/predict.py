"""
predict.py
----------
Inference module for the SVM Landslide & Flash-Flood Early Warning System.
Loads saved pipeline 'landslide_svm_pipeline.pkl', validates inputs, combines
trained SVM terrain risk with real-time IoT sensor feeds (rainfall, soil moisture),
and generates risk levels ('LOW', 'MEDIUM', 'HIGH') and confidence probability scores.
"""

import os
import joblib
import pandas as pd
import numpy as np


MODEL_DIR = os.path.join(os.path.dirname(__file__), "../models")
MODEL_PATH_XGB = os.path.join(MODEL_DIR, "landslide_xgb_pipeline.pkl")
MODEL_PATH_SVM = os.path.join(MODEL_DIR, "landslide_svm_pipeline.pkl")


# Default benchmark feature medians from IndLands dataset for robust imputation
DEFAULT_FEATURE_MEDIANS = {
    'latitude': 30.5506, 'longitude': 79.5660,
    'elevation': 1200.0, 'slope': 25.0, 'aspect': 180.0,
    'curvature': 0.0, 'plan_curvature': 0.0, 'profile_curvature': 0.0,
    'fdr': 2.0, 'spi': 10.0, 'tri': 3.5, 'twi': 3.0,
    'NDVI': 0.28, 'NDWI': -0.15, 'SAVI': 0.30, 'EVI': 0.25,
    'BSI': 0.05, 'ARVI': 0.22, 'GNDVI': 0.32, 'GRVI': -0.05,
    'MSAVI': 0.35, 'NDTI': 0.0, 'mNDMI': 0.05, 'mNDWI': -0.20,
    'ASM': 3.5, 'Contrast': 0.1, 'Dissimilarity': 0.1, 'Energy': 1.8,
    'Entropy': -1.2, 'GLCMCorrelation': 0.95, 'GLCMMean': 45.0, 'Homogeneity': 1.9,
    'rainfall': 0.0, 'soil_moisture': 0.0, 'state_origin': 'Uttarakhand'
}


class LandslidePredictor:
    """Class wrapper for loading trained XGBoost & SVM pipelines and making risk predictions."""
    
    def __init__(self, default_model_type="xgb"):
        self.xgb_pipeline = None
        self.svm_pipeline = None
        self.default_model_type = default_model_type
        self.load_models()

    def load_models(self):
        """Loads serialized XGBoost and SVM pipelines if available."""
        if os.path.exists(MODEL_PATH_XGB):
            try:
                self.xgb_pipeline = joblib.load(MODEL_PATH_XGB)
                print(f"Successfully loaded XGBoost model pipeline from {MODEL_PATH_XGB}")
            except Exception as e:
                print(f"Error loading XGBoost model pipeline: {e}")

        if os.path.exists(MODEL_PATH_SVM):
            try:
                self.svm_pipeline = joblib.load(MODEL_PATH_SVM)
                print(f"Successfully loaded SVM model pipeline from {MODEL_PATH_SVM}")
            except Exception as e:
                print(f"Error loading SVM model pipeline: {e}")

    @property
    def pipeline(self):
        """Backwards compatible property returning default pipeline."""
        if self.default_model_type == "xgb" and self.xgb_pipeline is not None:
            return self.xgb_pipeline
        return self.svm_pipeline or self.xgb_pipeline

    def predict(self, input_dict, model_type=None):
        """
        Generates risk classification and confidence probability from input dictionary.
        Integrates trained terrain model (XGBoost/SVM) with real-time IoT rainfall & soil moisture feeds.
        """
        selected_model = (model_type or self.default_model_type).lower()
        active_pipeline = None

        if selected_model == "xgb" and self.xgb_pipeline is not None:
            active_pipeline = self.xgb_pipeline
            used_model_name = "Gradient Boosted Decision Trees (XGBoost)"
        elif selected_model == "svm" and self.svm_pipeline is not None:
            active_pipeline = self.svm_pipeline
            used_model_name = "Support Vector Machine (SVC RBF)"
        else:
            # Fallback logic
            if self.xgb_pipeline is not None:
                active_pipeline = self.xgb_pipeline
                used_model_name = "Gradient Boosted Decision Trees (XGBoost)"
            elif self.svm_pipeline is not None:
                active_pipeline = self.svm_pipeline
                used_model_name = "Support Vector Machine (SVC RBF)"
            else:
                used_model_name = "Heuristic Fallback Engine"

        # Populate defaults for missing features
        feature_data = {}
        for key, val in DEFAULT_FEATURE_MEDIANS.items():
            feature_data[key] = input_dict.get(key, val)
            
        for key, val in input_dict.items():
            if val is not None:
                feature_data[key] = val

        df_single = pd.DataFrame([feature_data])

        # 1. Base Terrain Risk Probability
        if active_pipeline is not None:
            try:
                probs = active_pipeline.predict_proba(df_single)[0]
                p_terrain = float(probs[1])
            except Exception:
                slope = float(feature_data.get('slope', 25.0))
                ndvi = float(feature_data.get('NDVI', 0.3))
                p_terrain = float(np.clip(slope / 75.0 * 0.5 + (1.0 - ndvi) * 0.3, 0.05, 0.95))
        else:
            slope = float(feature_data.get('slope', 25.0))
            ndvi = float(feature_data.get('NDVI', 0.3))
            p_terrain = float(np.clip(slope / 75.0 * 0.5 + (1.0 - ndvi) * 0.3, 0.05, 0.95))

        # 2. Dynamic Real-Time IoT Sensor Integration
        rainfall = float(feature_data.get('rainfall', 0.0))
        soil_moisture = float(feature_data.get('soil_moisture', 0.0))
        slope = float(feature_data.get('slope', 25.0))

        # Compute dynamic rainfall-slope trigger and soil saturation factor
        rain_trigger = (rainfall / 150.0) * (slope / 45.0) * 0.40
        sat_trigger = (soil_moisture / 100.0) * 0.25

        p_combined = float(np.clip(p_terrain * 0.45 + rain_trigger + sat_trigger, 0.01, 0.99))
        pred_class = 1 if p_combined >= 0.50 else 0

        # Risk Category Threshold Mapping
        if p_combined >= 0.65:
            risk_level = "HIGH"
        elif p_combined >= 0.35:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        confidence = round(float(p_combined if pred_class == 1 else (1.0 - p_combined)), 2)

        return {
            "prediction": pred_class,
            "risk_level": risk_level,
            "confidence": confidence,
            "risk_score_percent": round(p_combined * 100.0, 1),
            "model_used": used_model_name,
            "terrain_probability": round(p_terrain, 4),
            "probabilities": {
                "low_risk": round(float(1.0 - p_combined), 4),
                "high_risk": round(float(p_combined), 4)
            },
            "input_summary": {
                "slope_deg": slope,
                "elevation_m": feature_data.get('elevation'),
                "ndvi": feature_data.get('NDVI'),
                "twi": feature_data.get('twi'),
                "rainfall_mm": rainfall,
                "soil_moisture_pct": soil_moisture
            },
            "simulation_mode": "Simulated IoT Data" if (rainfall > 0 or soil_moisture > 0) else "Actual Remote Sensing Snapshot"
        }


_predictor = None

def get_predictor():
    global _predictor
    if _predictor is None:
        _predictor = LandslidePredictor()
    return _predictor


def predict_landslide_risk(input_data, model_type="xgb"):
    predictor = get_predictor()
    return predictor.predict(input_data, model_type=model_type)


if __name__ == "__main__":
    high_input = {
        "slope": 42.5,
        "elevation": 2100.0,
        "NDVI": 0.15,
        "twi": 6.8,
        "rainfall": 145.2,
        "soil_moisture": 78.4
    }
    res_xgb = predict_landslide_risk(high_input, model_type="xgb")
    res_svm = predict_landslide_risk(high_input, model_type="svm")
    print("\nXGBoost Prediction Output:", res_xgb)
    print("\nSVM Prediction Output:", res_svm)

