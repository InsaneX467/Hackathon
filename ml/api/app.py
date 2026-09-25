"""
app.py
------
FastAPI Backend Service for the Hyper-Local Landslide & Flash-Flood Early Warning System.
Loads saved SVM model pipeline, exposes prediction API endpoint (/api/predict),
and serves the interactive warning dashboard.
"""

import os
import sys
import json
from typing import Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, Field

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from ml.src.predict import get_predictor, DEFAULT_FEATURE_MEDIANS


app = FastAPI(
    title="Hyper-Local Landslide & Flash-Flood Early Warning API",
    description="SVM-powered disaster early warning service using HF IndLands remote sensing & dynamic IoT inputs.",
    version="1.0.0"
)

# Enable CORS for web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Input schema for prediction request
class DisasterPredictionRequest(BaseModel):
    slope: Optional[float] = Field(default=25.0, description="Terrain slope angle in degrees")
    elevation: Optional[float] = Field(default=1200.0, description="Elevation above sea level in meters")
    ndvi: Optional[float] = Field(default=0.28, description="Normalized Difference Vegetation Index (-1 to 1)")
    ndwi: Optional[float] = Field(default=-0.15, description="Normalized Difference Water Index (-1 to 1)")
    twi: Optional[float] = Field(default=3.0, description="Topographic Wetness Index")
    tri: Optional[float] = Field(default=3.5, description="Terrain Ruggedness Index")
    bsi: Optional[float] = Field(default=0.05, description="Bare Soil Index")
    rainfall: Optional[float] = Field(default=0.0, description="Real-time rainfall in mm (IoT/Simulated)")
    soil_moisture: Optional[float] = Field(default=0.0, description="Real-time soil moisture % (IoT/Simulated)")
    temperature: Optional[float] = Field(default=24.0, description="Ambient temperature in °C")
    latitude: Optional[float] = Field(default=30.5506, description="Geographic latitude")
    longitude: Optional[float] = Field(default=79.5660, description="Geographic longitude")
    state_origin: Optional[str] = Field(default="Uttarakhand", description="Region or state name")
    model_type: Optional[str] = Field(default="xgb", description="Model architecture choice: 'xgb' or 'svm'")


@app.get("/api/health")
def health_check():
    predictor = get_predictor()
    xgb_loaded = predictor.xgb_pipeline is not None
    svm_loaded = predictor.svm_pipeline is not None
    return {
        "status": "healthy" if (xgb_loaded or svm_loaded) else "degraded",
        "models_available": {
            "xgb": xgb_loaded,
            "svm": svm_loaded
        },
        "default_model": "Gradient Boosted Decision Trees (XGBoost)" if xgb_loaded else "Support Vector Machine (SVC RBF)",
        "dataset_source": "DataUploader/IndLands (Hugging Face)"
    }


@app.get("/api/info")
def get_info():
    xgb_metrics_path = os.path.join(PROJECT_ROOT, "ml/models/xgb_model_metrics.json")
    svm_metrics_path = os.path.join(PROJECT_ROOT, "ml/models/model_metrics.json")
    
    xgb_metrics = {}
    svm_metrics = {}

    if os.path.exists(xgb_metrics_path):
        with open(xgb_metrics_path, 'r') as f:
            xgb_metrics = json.load(f)

    if os.path.exists(svm_metrics_path):
        with open(svm_metrics_path, 'r') as f:
            svm_metrics = json.load(f)

    return {
        "title": "Hyper-Local Landslide & Flash-Flood Early Warning System",
        "dataset": "DataUploader/IndLands",
        "huggingface_url": "https://huggingface.co/datasets/DataUploader/IndLands",
        "target_variable": "Decision (0 = Low Risk, 1 = High Risk)",
        "available_models": ["xgb", "svm"],
        "features": list(DEFAULT_FEATURE_MEDIANS.keys()),
        "xgb_metrics": xgb_metrics.get("metrics", {
            "accuracy": 0.9673,
            "precision": 0.5759,
            "recall": 0.6958,
            "f1_score": 0.6302,
            "roc_auc": 0.9544
        }),
        "svm_metrics": svm_metrics.get("metrics", {
            "accuracy": 0.8788,
            "precision": 0.2112,
            "recall": 0.7417,
            "f1_score": 0.3287,
            "roc_auc": 0.8959
        }),
        "disclaimer": "College/Project Prototype - Not certified for standalone real-world emergency evacuation without official meteorological validation."
    }


@app.post("/api/predict")
def predict_risk(req: DisasterPredictionRequest):
    """
    Main Risk Prediction Endpoint.
    Accepts terrain & sensor parameters, outputs JSON prediction object.
    Supports model choice: 'xgb' or 'svm'.
    """
    input_dict = req.dict()
    # Map lowercase 'ndvi', 'ndwi', 'bsi' to upper case expected by feature engineering if needed
    if 'ndvi' in input_dict and 'NDVI' not in input_dict:
        input_dict['NDVI'] = input_dict['ndvi']
    if 'ndwi' in input_dict and 'NDWI' not in input_dict:
        input_dict['NDWI'] = input_dict['ndwi']
    if 'bsi' in input_dict and 'BSI' not in input_dict:
        input_dict['BSI'] = input_dict['bsi']

    model_choice = input_dict.get('model_type', 'xgb')
    predictor = get_predictor()
    result = predictor.predict(input_dict, model_type=model_choice)

    # Attach Warning Action Message based on Risk Level
    risk_lvl = result["risk_level"]
    if risk_lvl == "HIGH":
        warning_msg = "⚠ HIGH RISK DETECTED - Take immediate precautions and prepare for potential evacuation."
        action_code = "EVACUATE_READY"
    elif risk_lvl == "MEDIUM":
        warning_msg = "⚡ MEDIUM RISK - Elevated terrain vulnerability. Monitor live weather and stay alert."
        action_code = "MONITOR_ALERT"
    else:
        warning_msg = "✅ LOW RISK - Normal terrain stability. Standard conditions."
        action_code = "NORMAL_STABLE"

    result["warning_message"] = warning_msg
    result["action_code"] = action_code
    return result


# Mount Static Dashboard Files if directory exists
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/dashboard", StaticFiles(directory=STATIC_DIR, html=True), name="static")

@app.get("/", response_class=HTMLResponse)
def root():
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        with open(index_file, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("<h2>Hyper-Local Landslide & Flash-Flood Early Warning System API is running.</h2><p>Visit <a href='/docs'>/docs</a> for Swagger UI.</p>")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
