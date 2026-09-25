"""
train.py
--------
Training script for the SVM Landslide & Flash-Flood Early Warning System.
Builds the full scikit-learn pipeline (Feature Engineering -> Preprocessing -> SVM Classifier),
tunes hyperparameters with GridSearchCV, handles class imbalance, and saves the trained pipeline artifact.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.metrics import (
    classification_report, confusion_matrix, accuracy_score,
    precision_score, recall_score, f1_score, roc_auc_score
)

from ml.src.data_loader import load_indlands_data, NUMERICAL_FEATURES, TARGET_COLUMN
from ml.src.feature_engineering import LandslideFeatureEngineer
from ml.src.preprocessing import build_preprocessing_pipeline


MODEL_DIR = os.path.join(os.path.dirname(__file__), "../models")
MODEL_PATH = os.path.join(MODEL_DIR, "landslide_svm_pipeline.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "model_metrics.json")


def train_svm_pipeline(sample_per_state=2500, perform_grid_search=True, random_state=42):
    """
    Trains the end-to-end SVM Landslide & Flash-Flood prediction pipeline.

    Parameters:
    -----------
    sample_per_state : int
        Number of records sampled per state for model training.
    perform_grid_search : bool
        Whether to run GridSearchCV for hyperparameter tuning.
    random_state : int
        Fixed random seed for reproducibility.

    Returns:
    --------
    tuple: (trained_pipeline, metrics_dict, X_test, y_test)
    """
    os.makedirs(MODEL_DIR, exist_ok=True)

    print("\n" + "=" * 60, flush=True)
    print("        STARTING SVM MODEL TRAINING PROCEDURE", flush=True)
    print("=" * 60, flush=True)
    
    # 1. Load multi-state data
    print("\n[Step 1/5] Loading IndLands multi-state dataset...", flush=True)
    df = load_indlands_data(sample_per_state=sample_per_state, random_state=random_state)
    
    X = df.drop(columns=[c for c in df.columns if c in [TARGET_COLUMN, 'glcm', 'Unnamed: 3', 'Unnamed: 4']])
    y = df[TARGET_COLUMN].astype(int)

    # 2. Train / Test Split
    print("\n[Step 2/5] Performing Stratified Train-Test Split (80/20)...", flush=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=random_state, stratify=y
    )
    print(f"  Training set size : {X_train.shape[0]} samples", flush=True)
    print(f"  Testing set size  : {X_test.shape[0]} samples", flush=True)
    print(f"  Train class distribution : {dict(pd.Series(y_train).value_counts())}", flush=True)
    print(f"  Test class distribution  : {dict(pd.Series(y_test).value_counts())}", flush=True)

    # Identify numerical feature list
    feature_engineer = LandslideFeatureEngineer()
    df_sample = feature_engineer.transform(X_train.iloc[:5])
    
    engineered_cols = [
        'slope_elevation_ratio', 'wetness_moisture_index', 'vegetation_instability',
        'ruggedness_steepness_factor', 'soil_exposure_ratio', 'rainfall_slope_risk',
        'soil_saturation_twi_risk'
    ]
    all_num_cols = [c for c in NUMERICAL_FEATURES if c in df_sample.columns] + engineered_cols
    cat_cols = ['state_origin'] if 'state_origin' in df_sample.columns else None

    # 3. Construct Scikit-Learn Pipeline
    print("\n[Step 3/5] Assembling sklearn Pipeline (Feature Engineering -> Preprocessor -> SVM)...", flush=True)
    preprocessor = build_preprocessing_pipeline(
        numerical_features=all_num_cols,
        categorical_features=cat_cols
    )

    base_svm = SVC(
        kernel='rbf',
        probability=True,
        class_weight='balanced',
        random_state=random_state
    )

    pipeline = Pipeline([
        ('feature_engineer', feature_engineer),
        ('preprocessor', preprocessor),
        ('svm', base_svm)
    ])

    # 4. Hyperparameter Tuning / Model Fitting
    if perform_grid_search:
        print("\n[Step 4/5] Running GridSearchCV for SVM Hyperparameter Optimization...", flush=True)
        param_grid = {
            'svm__C': [0.5, 2.0],
            'svm__gamma': ['scale', 'auto'],
            'svm__kernel': ['rbf']
        }
        cv_strategy = StratifiedKFold(n_splits=3, shuffle=True, random_state=random_state)
        grid_search = GridSearchCV(
            pipeline,
            param_grid=param_grid,
            cv=cv_strategy,
            scoring='f1',
            n_jobs=-1,
            verbose=1
        )
        grid_search.fit(X_train, y_train)
        best_pipeline = grid_search.best_estimator_
        print(f"  Best Parameters Found: {grid_search.best_params_}", flush=True)
        print(f"  Best Cross-Validation F1-Score: {grid_search.best_score_:.4f}", flush=True)
    else:
        print("\n[Step 4/5] Fitting base SVM Pipeline...", flush=True)
        best_pipeline = pipeline.fit(X_train, y_train)

    # 5. Model Evaluation
    print("\n[Step 5/5] Evaluating Model on Test Set...", flush=True)
    y_pred = best_pipeline.predict(X_test)
    y_prob = best_pipeline.predict_proba(X_test)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    try:
        roc_auc = float(roc_auc_score(y_test, y_prob))
    except Exception:
        roc_auc = 0.5

    cm = confusion_matrix(y_test, y_pred).tolist()
    clf_report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

    print(f"\n--- EVALUATION METRICS ---", flush=True)
    print(f"  Accuracy  : {acc:.4f} ({acc*100:.2f}%)", flush=True)
    print(f"  Precision : {prec:.4f}", flush=True)
    print(f"  Recall    : {rec:.4f}  (Critical for Early Warning!)", flush=True)
    print(f"  F1-Score  : {f1:.4f}", flush=True)
    print(f"  ROC-AUC   : {roc_auc:.4f}", flush=True)
    print(f"\nConfusion Matrix:\n{np.array(cm)}", flush=True)

    # Save Pipeline and Metrics
    print(f"\nSaving pipeline artifact to {MODEL_PATH}...", flush=True)
    saved_metadata = {
        "pipeline": best_pipeline,
        "features": all_num_cols,
        "metrics": {
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "roc_auc": roc_auc
        }
    }
    joblib.dump(best_pipeline, MODEL_PATH)

    metrics_metadata = {
        "model_name": "Support Vector Machine (SVC RBF Kernel)",
        "dataset": "DataUploader/IndLands",
        "sample_size": len(df),
        "test_size": len(y_test),
        "hyperparameters": {
            "C": float(best_pipeline.named_steps['svm'].C),
            "gamma": str(best_pipeline.named_steps['svm'].gamma),
            "kernel": str(best_pipeline.named_steps['svm'].kernel),
            "class_weight": "balanced"
        },
        "metrics": {
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "roc_auc": roc_auc
        },
        "confusion_matrix": cm,
        "classification_report": clf_report
    }

    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics_metadata, f, indent=2)

    print(f"Saved evaluation metrics to {METRICS_PATH}", flush=True)
    print("=" * 60 + "\n", flush=True)
    return best_pipeline, metrics_metadata, X_test, y_test


if __name__ == "__main__":
    train_svm_pipeline(sample_per_state=2500, perform_grid_search=True)
