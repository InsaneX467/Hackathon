"""
train_xgb.py
------------
Training script for the XGBoost Landslide & Flash-Flood Early Warning System.
Builds an end-to-end pipeline (Feature Engineering -> Preprocessing -> XGBoost Classifier),
handles class imbalance using dynamic scale_pos_weight, evaluates metrics, and saves model artifacts.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    classification_report, confusion_matrix, accuracy_score,
    precision_score, recall_score, f1_score, roc_auc_score
)
import xgboost as xgb

from ml.src.data_loader import load_indlands_data, NUMERICAL_FEATURES, TARGET_COLUMN
from ml.src.feature_engineering import LandslideFeatureEngineer
from ml.src.preprocessing import build_preprocessing_pipeline


MODEL_DIR = os.path.join(os.path.dirname(__file__), "../models")
MODEL_PATH = os.path.join(MODEL_DIR, "landslide_xgb_pipeline.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "xgb_model_metrics.json")
CONFUSION_MATRIX_PATH = os.path.join(MODEL_DIR, "xgb_confusion_matrix.png")


def train_xgb_pipeline(sample_per_state=5000, perform_grid_search=False, random_state=42):
    """
    Trains the end-to-end XGBoost Landslide & Flash-Flood prediction pipeline.

    Parameters:
    -----------
    sample_per_state : int
        Number of records sampled per state for model training.
    perform_grid_search : bool
        Whether to run hyperparameter tuning.
    random_state : int
        Fixed random seed for reproducibility.

    Returns:
    --------
    tuple: (trained_pipeline, metrics_dict, X_test, y_test)
    """
    os.makedirs(MODEL_DIR, exist_ok=True)

    print("\n" + "=" * 60, flush=True)
    print("      STARTING XGBOOST MODEL TRAINING PROCEDURE", flush=True)
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

    # Calculate class imbalance ratio for scale_pos_weight
    num_neg = (y_train == 0).sum()
    num_pos = (y_train == 1).sum()
    scale_pos_weight = float(num_neg / max(num_pos, 1))
    print(f"  Calculated scale_pos_weight for imbalance: {scale_pos_weight:.2f}", flush=True)

    # 3. Construct Scikit-Learn Pipeline
    print("\n[Step 3/5] Assembling sklearn Pipeline (Feature Engineering -> Preprocessor -> XGBoost)...", flush=True)
    preprocessor = build_preprocessing_pipeline(
        numerical_features=all_num_cols,
        categorical_features=cat_cols
    )

    base_xgb = xgb.XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        scale_pos_weight=scale_pos_weight,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=random_state,
        eval_metric="logloss",
        n_jobs=-1
    )

    pipeline = Pipeline([
        ('feature_engineer', feature_engineer),
        ('preprocessor', preprocessor),
        ('classifier', base_xgb)
    ])

    # 4. Model Fitting / Optional Hyperparameter Tuning
    if perform_grid_search:
        print("\n[Step 4/5] Running GridSearchCV for XGBoost Optimization...", flush=True)
        param_grid = {
            'classifier__n_estimators': [200, 300],
            'classifier__max_depth': [4, 6],
            'classifier__learning_rate': [0.03, 0.05]
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
        print("\n[Step 4/5] Fitting XGBoost Pipeline...", flush=True)
        best_pipeline = pipeline.fit(X_train, y_train)

    # 5. Model Evaluation
    print("\n[Step 5/5] Evaluating XGBoost Model on Test Set...", flush=True)
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

    print(f"\n--- XGBOOST EVALUATION METRICS ---", flush=True)
    print(f"  Accuracy  : {acc:.4f} ({acc*100:.2f}%)", flush=True)
    print(f"  Precision : {prec:.4f}", flush=True)
    print(f"  Recall    : {rec:.4f}  (Critical for Early Warning!)", flush=True)
    print(f"  F1-Score  : {f1:.4f}", flush=True)
    print(f"  ROC-AUC   : {roc_auc:.4f}", flush=True)
    print(f"\nConfusion Matrix:\n{np.array(cm)}", flush=True)

    # Plot Confusion Matrix Heatmap
    cm_array = np.array(cm)
    plt.figure(figsize=(7, 6))
    sns.set_theme(style="white")
    ax = sns.heatmap(
        cm_array,
        annot=True,
        fmt='d',
        cmap='Greens',
        cbar=True,
        xticklabels=['Low Risk (0)', 'High Risk (1)'],
        yticklabels=['Low Risk (0)', 'High Risk (1)'],
        annot_kws={"size": 14, "weight": "bold"}
    )
    plt.title("XGBoost Landslide Early Warning Model - Confusion Matrix", fontsize=13, fontweight='bold', pad=15)
    plt.xlabel("Predicted Label", fontsize=11, labelpad=10)
    plt.ylabel("Actual Ground Truth Label", fontsize=11, labelpad=10)
    plt.tight_layout()
    plt.savefig(CONFUSION_MATRIX_PATH, dpi=300, bbox_inches='tight')
    plt.close()

    # Save Pipeline and Metrics Artifacts
    print(f"\nSaving XGBoost pipeline artifact to {MODEL_PATH}...", flush=True)
    joblib.dump(best_pipeline, MODEL_PATH)

    xgb_clf = best_pipeline.named_steps['classifier']
    metrics_metadata = {
        "model_name": "Gradient Boosted Decision Trees (XGBoost)",
        "dataset": "DataUploader/IndLands",
        "sample_size": len(df),
        "test_size": len(y_test),
        "hyperparameters": {
            "n_estimators": int(xgb_clf.n_estimators),
            "max_depth": int(xgb_clf.max_depth),
            "learning_rate": float(xgb_clf.learning_rate),
            "scale_pos_weight": float(xgb_clf.scale_pos_weight),
            "subsample": float(xgb_clf.subsample),
            "colsample_bytree": float(xgb_clf.colsample_bytree)
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

    print(f"Saved XGBoost metrics to {METRICS_PATH}", flush=True)
    print("=" * 60 + "\n", flush=True)
    return best_pipeline, metrics_metadata, X_test, y_test


if __name__ == "__main__":
    train_xgb_pipeline(sample_per_state=5000, perform_grid_search=False)
