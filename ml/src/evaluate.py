"""
evaluate.py
-----------
Evaluation script for the SVM Landslide & Flash-Flood Early Warning System.
Loads saved model pipeline, computes comprehensive classification metrics,
prints detailed performance reports, and exports confusion matrix visualizations.
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

from sklearn.metrics import (
    classification_report, confusion_matrix, accuracy_score,
    precision_score, recall_score, f1_score, roc_auc_score, roc_curve
)


MODEL_DIR = os.path.join(os.path.dirname(__file__), "../models")
MODEL_PATH = os.path.join(MODEL_DIR, "landslide_svm_pipeline.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "model_metrics.json")
NOTEBOOKS_DIR = os.path.join(os.path.dirname(__file__), "../notebooks")
ARTIFACT_DIR = r"C:\Users\prant\.gemini\antigravity-ide\brain\291e153a-528d-438e-9114-d5cfce9bdaf0"


def generate_evaluation_visualizations(cm, metrics):
    """Generates and saves confusion matrix heatmap and metrics charts."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.makedirs(NOTEBOOKS_DIR, exist_ok=True)
    os.makedirs(ARTIFACT_DIR, exist_ok=True)

    cm_array = np.array(cm)
    plt.figure(figsize=(7, 6))
    sns.set_theme(style="white")
    
    # Custom color palette matching warning UI
    ax = sns.heatmap(
        cm_array,
        annot=True,
        fmt='d',
        cmap='YlOrRd',
        cbar=True,
        xticklabels=['Low Risk (0)', 'High Risk (1)'],
        yticklabels=['Low Risk (0)', 'High Risk (1)'],
        annot_kws={"size": 14, "weight": "bold"}
    )
    plt.title("SVM Landslide Early Warning Model - Confusion Matrix", fontsize=13, fontweight='bold', pad=15)
    plt.xlabel("Predicted Label", fontsize=11, labelpad=10)
    plt.ylabel("Actual Ground Truth Label", fontsize=11, labelpad=10)
    plt.tight_layout()

    out_paths = [
        os.path.join(MODEL_DIR, "confusion_matrix.png"),
        os.path.join(NOTEBOOKS_DIR, "confusion_matrix.png"),
        os.path.join(ARTIFACT_DIR, "confusion_matrix.png")
    ]

    for path in out_paths:
        plt.savefig(path, dpi=300, bbox_inches='tight')
        print(f"Saved confusion matrix graphic: {path}")

    plt.close()


def print_evaluation_summary():
    """Reads saved metrics and prints structured evaluation report."""
    if not os.path.exists(METRICS_PATH):
        print(f"Error: Metrics file {METRICS_PATH} not found. Run training first.")
        return

    with open(METRICS_PATH, 'r') as f:
        data = json.load(f)

    print("\n" + "=" * 65)
    print("    LANDSLIDE & FLASH-FLOOD EARLY WARNING SYSTEM - MODEL EVALUATION")
    print("=" * 65)
    print(f"Model Architecture  : {data.get('model_name')}")
    print(f"Training Dataset    : {data.get('dataset')}")
    print(f"Sample Size         : {data.get('sample_size')} records")
    print(f"Test Set Size       : {data.get('test_size')} records")
    print("\nTuned Hyperparameters:")
    for k, v in data.get('hyperparameters', {}).items():
        print(f"  - {k}: {v}")

    metrics = data.get('metrics', {})
    print("\nQuantitative Evaluation Metrics:")
    print(f"  • Accuracy        : {metrics.get('accuracy', 0):.4f} ({metrics.get('accuracy', 0)*100:.2f}%)")
    print(f"  • Precision       : {metrics.get('precision', 0):.4f}")
    print(f"  • Recall          : {metrics.get('recall', 0):.4f}  <-- Disaster Safety Target")
    print(f"  • F1-Score        : {metrics.get('f1_score', 0):.4f}")
    print(f"  • ROC-AUC Score   : {metrics.get('roc_auc', 0):.4f}")

    print("\nConfusion Matrix:")
    cm = data.get('confusion_matrix', [[0, 0], [0, 0]])
    print(f"  TN (Safe correctly predicted): {cm[0][0]}")
    print(f"  FP (False Alarm warning)     : {cm[0][1]}")
    print(f"  FN (MISSING DISASTER RISK)   : {cm[1][0]}  <-- MINIMIZED BY RECALL")
    print(f"  TP (Disaster correctly caught): {cm[1][1]}")

    generate_evaluation_visualizations(cm, metrics)
    print("=" * 65 + "\n")


if __name__ == "__main__":
    print_evaluation_summary()
