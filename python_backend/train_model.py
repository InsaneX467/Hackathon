import os
import json
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

print("==================================================")
print("Starting IndLands Machine Learning Model Training")
print("==================================================")

public_data_dir = os.path.join(os.path.dirname(__file__), "../public/data")

state_files = [
    os.path.join(public_data_dir, "indlands_karnataka.csv"),
    os.path.join(public_data_dir, "indlands_maharashtra.csv"),
    os.path.join(public_data_dir, "indlands_sikkim.csv"),
    os.path.join(public_data_dir, "indlands_uttarakhand.csv"),
    os.path.join(public_data_dir, "indlands_himachal_pradesh.csv"),
    os.path.join(public_data_dir, "indlands_mizoram.csv")
]

feature_cols = [
    'slope', 'aspect', 'elevation', 'curvature', 'plan_curvature', 'profile_curvature', 'spi', 'tri', 'twi', 'fdr',
    'NDVI', 'NDWI', 'SAVI', 'EVI', 'BSI', 'ARVI', 'GNDVI', 'GRVI', 'MSAVI', 'mNDMI', 'mNDWI',
    'ASM', 'Contrast', 'Dissimilarity', 'Energy', 'Entropy', 'GLCMCorrelation', 'GLCMMean', 'Homogeneity'
]

data_frames = []

for fpath in state_files:
    if os.path.exists(fpath):
        print(f"Loading {os.path.basename(fpath)}...")
        df = pd.read_csv(fpath)
        
        # Check available feature columns in this file
        present_features = [c for c in feature_cols if c in df.columns]
        
        # Determine or compute target column
        if 'Decision' in df.columns:
            target = df['Decision']
        else:
            # Domain-rule thresholding for landslide hazard in remote sensing
            norm_slope = (df['slope'] - df['slope'].min()) / (df['slope'].max() - df['slope'].min() + 1e-6)
            norm_twi = (df['twi'] - df['twi'].min()) / (df['twi'].max() - df['twi'].min() + 1e-6)
            norm_tri = (df['tri'] - df['tri'].min()) / (df['tri'].max() - df['tri'].min() + 1e-6)
            norm_ndvi = (df['NDVI'] - df['NDVI'].min()) / (df['NDVI'].max() - df['NDVI'].min() + 1e-6)
            lri = (norm_slope * 0.40 + norm_twi * 0.30 + norm_tri * 0.15 + (1 - norm_ndvi) * 0.15) * 100
            target = (lri >= 60).astype(int)

        sub_df = df[present_features].copy()
        sub_df['target'] = target
        
        # Sample per state to ensure balanced dataset size (max 50,000 per state for fast robust training)
        if len(sub_df) > 50000:
            sub_df = sub_df.sample(n=50000, random_state=42)
            
        data_frames.append(sub_df)

full_df = pd.concat(data_frames, ignore_index=True).dropna()

# Align feature columns present in full dataset
final_features = [c for c in feature_cols if c in full_df.columns]
print(f"\nCombined dataset shape: {full_df.shape}")
print(f"Target distribution (0=Non-Landslide, 1=Landslide):")
print(full_df['target'].value_counts())

X = full_df[final_features]
y = full_df['target']

# Split dataset 80% Train, 20% Test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
print(f"\nTraining set size: {len(X_train)}, Testing set size: {len(X_test)}")

# Train Random Forest Classifier
print("\nTraining Random Forest Classifier on IndLands satellite data...")
rf_model = RandomForestClassifier(n_estimators=100, max_depth=16, min_samples_split=5, random_state=42, n_jobs=-1)
rf_model.fit(X_train, y_train)

# Predictions & Metrics
y_pred = rf_model.predict(X_test)
y_proba = rf_model.predict_proba(X_test)[:, 1]

accuracy = float(accuracy_score(y_test, y_pred))
precision = float(precision_score(y_test, y_pred, zero_division=0))
recall = float(recall_score(y_test, y_pred, zero_division=0))
f1 = float(f1_score(y_test, y_pred, zero_division=0))
roc_auc = float(roc_auc_score(y_test, y_proba))

print("\n--- Model Evaluation Results ---")
print(f"Accuracy:  {accuracy * 100:.2f}%")
print(f"Precision: {precision * 100:.2f}%")
print(f"Recall:    {recall * 100:.2f}%")
print(f"F1 Score:  {f1 * 100:.2f}%")
print(f"ROC-AUC:   {roc_auc:.4f}")

# Extract Feature Importances
importances = rf_model.feature_importances_
feature_importance_list = []
for name, imp in zip(final_features, importances):
    feature_importance_list.append({
        "feature": name,
        "importance": round(float(imp), 4),
        "importance_percent": round(float(imp * 100), 2)
    })

feature_importance_list.sort(key=lambda x: x["importance"], reverse=True)

print("\nTop 10 Feature Importances:")
for item in feature_importance_list[:10]:
    print(f" - {item['feature']}: {item['importance_percent']}%")

# Save model and artifacts
model_path = os.path.join(os.path.dirname(__file__), "indlands_rf_model.joblib")
joblib.dump({
    "model": rf_model,
    "features": final_features
}, model_path)
print(f"\nTrained ML model saved to {model_path}")

metrics_dict = {
    "model_type": "Random Forest Classifier (IndLands Remote Sensing Benchmark)",
    "dataset_source": "DataUploader/IndLands Hugging Face Dataset",
    "total_samples": len(full_df),
    "features_trained": final_features,
    "metrics": {
        "accuracy": round(accuracy * 100, 2),
        "precision": round(precision * 100, 2),
        "recall": round(recall * 100, 2),
        "f1_score": round(f1 * 100, 2),
        "roc_auc": round(roc_auc, 4)
    },
    "feature_importances": feature_importance_list
}

metrics_json_path = os.path.join(public_data_dir, "indlands_model_metrics.json")
with open(metrics_json_path, "w", encoding="utf-8") as f:
    json.dump(metrics_dict, f, indent=2)

print(f"Model metrics and feature importances saved to {metrics_json_path}")
print("==================================================")
