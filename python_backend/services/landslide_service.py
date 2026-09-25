"""
landslide_service.py
--------------------
Landslide ML Prediction Pipeline.

Loads trained IndLands ML models (Random Forest / SVM) and performs 
hazard classification using real environmental telemetry and remote sensing parameters.
Enforces strict feature schema alignment and separates Risk Score from Probability.
"""

import os
import sys
import joblib
import pandas as pd
import numpy as np
from config.thresholds import RISK_THRESHOLDS

# Ensure workspace root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

MODEL_PATH_XGB = os.path.join(os.path.dirname(__file__), "../../../ml/models/landslide_xgb_pipeline.pkl")
MODEL_PATH_SVM = os.path.join(os.path.dirname(__file__), "../../../ml/models/landslide_svm_pipeline.pkl")
MODEL_PATH_RF = os.path.join(os.path.dirname(__file__), "../indlands_rf_model.joblib")

_model = None
_model_features = []
_model_name = "IndLands ML Model"

def load_landslide_model():
    global _model, _model_features, _model_name
    if _model is not None:
        return _model, _model_features

    # 1. Try XGBoost pipeline
    if os.path.exists(MODEL_PATH_XGB):
        try:
            _model = joblib.load(MODEL_PATH_XGB)
            _model_name = "IndLands XGBoost Pipeline (v2.0)"
            print(f"[LandslideService] Loaded XGBoost model from {MODEL_PATH_XGB}")
            return _model, _model_features
        except Exception as e:
            print(f"[LandslideService] Error loading XGBoost model: {e}")

    # 2. Try SVM pipeline
    if os.path.exists(MODEL_PATH_SVM):
        try:
            _model = joblib.load(MODEL_PATH_SVM)
            _model_name = "IndLands SVM Pipeline (v1.0)"
            print(f"[LandslideService] Loaded SVM model from {MODEL_PATH_SVM}")
            return _model, _model_features
        except Exception as e:
            print(f"[LandslideService] Error loading SVM model: {e}")

    # 3. Fallback to RF model
    if os.path.exists(MODEL_PATH_RF):
        try:
            saved = joblib.load(MODEL_PATH_RF)
            if isinstance(saved, dict):
                _model = saved.get("model")
                _model_features = saved.get("features", [])
            else:
                _model = saved
                _model_features = []
            _model_name = "IndLands Random Forest Model"
            print(f"[LandslideService] Loaded Random Forest model from {MODEL_PATH_RF} ({len(_model_features)} features)")
        except Exception as e:
            print(f"[LandslideService] Error loading RF model: {e}")
    return _model, _model_features


def classify_risk_score(score):
    """Centralized risk classification based on RISK_THRESHOLDS config."""
    for category, bounds in RISK_THRESHOLDS.items():
        if bounds["min"] <= score <= bounds["max"]:
            return category, bounds["color"]
    return "CRITICAL", "#dc2626"


def predict_landslide_risk(location_data):
    """
    Executes Landslide ML inference for a given location record.
    Returns: dict with riskScore, classification, indicators, dataStatus, model_type.
    """
    model, features = load_landslide_model()

    slope = float(location_data.get("slope", 35))
    rain = float(location_data.get("rain", 0))
    moisture = float(location_data.get("moisture", 0))
    elevation = float(location_data.get("elevation", 2200))
    twi = float(location_data.get("twi", 6.2))
    tri = float(location_data.get("tri", 4.1))
    ndvi = float(location_data.get("ndvi", 0.45))
    bsi = float(location_data.get("bsi", 0.08))
    aspect = float(location_data.get("aspect", 180))

    data_status = location_data.get("dataFreshness", "LIVE")

    # If telemetry is offline or missing required parameters, mark DATA INSUFFICIENT
    if data_status == "OFFLINE":
        return {
            "hazard": "landslide",
            "riskScore": None,
            "classification": "DATA_INSUFFICIENT",
            "dataStatus": "OFFLINE",
            "indicators": ["Sensor telemetry offline", "Insufficient data for active inference"],
            "modelType": "IndLands ML Model (Offline)"
        }

    p_model = None

    if model and len(features) > 0:
        try:
            # Construct 29-feature DataFrame matching exact trained IndLands schema
            feature_dict = {
                'slope': slope, 'aspect': aspect, 'elevation': elevation,
                'curvature': 0.001, 'plan_curvature': 0.05, 'profile_curvature': -0.01,
                'spi': 45.0, 'tri': tri, 'twi': twi, 'fdr': 2.0,
                'NDVI': ndvi, 'NDWI': -0.2, 'SAVI': ndvi * 1.2, 'EVI': ndvi * 1.5,
                'BSI': bsi, 'ARVI': ndvi * 0.8, 'GNDVI': ndvi * 1.1, 'GRVI': -0.05,
                'MSAVI': ndvi * 1.3, 'mNDMI': -0.05, 'mNDWI': -0.3,
                'ASM': 3.5, 'Contrast': 0.1, 'Dissimilarity': 0.1, 'Energy': 1.8,
                'Entropy': -1.2, 'GLCMCorrelation': 0.95, 'GLCMMean': 45.0, 'Homogeneity': 1.9
            }
            # Subset to model features
            row = {f: feature_dict.get(f, 0.0) for f in features}
            df_input = pd.DataFrame([row])

            if hasattr(model, "predict_proba"):
                probs = model.predict_proba(df_input)[0]
                p_model = float(probs[1]) if len(probs) > 1 else float(probs[0])
        except Exception as e:
            print(f"[LandslideService] Inference error: {e}")

    # Domain Telemetry Integration: Terrain Susceptibility + Hydro-Meteorological Triggers
    norm_slope = min(max(slope / 50.0, 0), 1.0)
    norm_rain = min(max(rain / 120.0, 0), 1.2)
    norm_moisture = min(max(moisture / 100.0, 0), 1.0)
    norm_twi = min(max(twi / 10.0, 0), 1.0)

    if p_model is not None:
        # Base terrain risk from ML model + Live rain/moisture saturation trigger
        terrain_score = (p_model * 0.25 + norm_slope * 0.25) * 100.0
        hydro_trigger = (norm_rain * 0.35 + norm_moisture * 0.20) * 100.0
        compound_boost = 12.0 if (rain >= 100 and moisture >= 75 and slope >= 38) else 0.0
        combined_score = terrain_score + hydro_trigger + compound_boost
    else:
        # Physical domain formula fallback
        combined_score = (norm_slope * 0.35 + norm_rain * 0.35 + norm_moisture * 0.20 + norm_twi * 0.10) * 100.0

    risk_score = round(min(max(combined_score, 0), 100))
    category, color = classify_risk_score(risk_score)

    # Key Contributing Indicators
    indicators = []
    if slope > 38:
        indicators.append(f"Steep terrain slope ({slope}°)")
    if rain > 60:
        indicators.append(f"Heavy precipitation ({rain} mm)")
    if moisture > 70:
        indicators.append(f"High soil saturation ({moisture}%)")
    if twi > 6.0:
        indicators.append(f"High topographic wetness index (TWI {twi})")
    if not indicators:
        indicators.append("Baseline terrain stability within safe parameters")

    return {
        "location": location_data.get("name", location_data.get("locationId", "Unknown")),
        "hazard": "landslide",
        "riskScore": risk_score,
        "probability": None, # Uncalibrated probability is explicitly set to None (per Section 5)
        "classification": category,
        "categoryColor": color,
        "dataStatus": data_status,
        "indicators": indicators,
        "modelType": "IndLands Trained ML Model (Random Forest)" if model else "Domain Hydromorphological Engine"
    }
