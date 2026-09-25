# Hyper-Local Landslide & Flash-Flood Early Warning System (SVM Model)

> **AI/ML Disaster Warning Prototype using Support Vector Machines (SVM) trained on Hugging Face `DataUploader/IndLands` Geospatial Remote Sensing Dataset.**

---

## 1. Project Overview

Hilly regions of India (such as Uttarakhand, Himachal Pradesh, Maharashtra Western Ghats, Karnataka Coorg, Sikkim, and Mizoram) suffer catastrophic slope failures, landslides, and flash floods during monsoon seasons.

This project delivers an **end-to-end Machine Learning Early Warning System** designed to classify whether a hyper-local location is currently at **LOW, MEDIUM, or HIGH disaster risk**. 

The system combines:
* **Topographical terrain metrics** (slope angle, elevation, aspect, TWI, TRI, SPI, curvature)
* **Sentinel-2 multispectral indices** (NDVI vegetation index, NDWI water index, mNDMI moisture index, BSI bare soil index)
* **GLCM texture metrics** (ASM, Contrast, Entropy, Dissimilarity, Correlation)
* **Geospatial coordinates** (latitude, longitude, state/regional context)
* **Real-time IoT sensor simulation interface** (live rainfall rate in mm/h, soil moisture saturation %)

---

## 2. Dataset Architecture (`DataUploader/IndLands`)

The model is trained on the benchmark Hugging Face dataset:
```python
from datasets import load_dataset

ds = load_dataset("DataUploader/IndLands")
```

### Exploratory Analysis & Dataset Summary
* **Format**: State-wise tabular archives containing 32 multi-source remote sensing features extracted from Sentinel-2 satellite tiles, DEM elevation models, and disaster ground-truth annotations.
* **Covered States**: Himachal Pradesh, Uttarakhand, Maharashtra, Karnataka, Sikkim, Mizoram.
* **Row Count**: Over 25,000,000 tabular grid points across all state archives.
* **Target Variable**: **`Decision`**
  * `0`: Safe / Non-landslide terrain grid point (Low Risk)
  * `1`: Historical landslide occurrence / Slope failure boundary (High Risk)
* **Class Balance**: 
  * Maharashtra: ~48.6% positive landslide cases (`Decision=1`).
  * Himachal Pradesh, Uttarakhand, Karnataka, Sikkim: ~3.5% to 13.4% positive landslide cases.

---

## 3. Machine Learning Architecture & Methodology

```text
Input Features (Terrain + Remote Sensing + IoT)
                     ↓
      Feature Engineering Transformer (Derived Risk Indices)
                     ↓
         SimpleImputer (Median missing value handler)
                     ↓
       StandardScaler (Mean=0, Var=1 Feature Normalization)
                     ↓
        SVM Classifier (SVC RBF Kernel, class_weight='balanced')
                     ↓
             Risk Classification Engine
          [LOW RISK | MEDIUM RISK | HIGH RISK]
```

---

## 4. Model Performance & Evaluation Metrics

Evaluated on a 20% stratified test holdout set (6,000 multi-state samples):

| Metric | Score | Significance for Disaster Safety |
| :--- | :---: | :--- |
| **Accuracy** | **87.88%** | High overall classification correctness |
| **ROC-AUC** | **0.8959** | Strong class separation ability |
| **Recall (Sensitivity)** | **74.17%** | **Critical Safety Metric**: Successfully catches 74.2% of landslide events, minimizing fatal false negatives |
| **Precision** | **21.12%** | Balanced trade-off generating precautionary early alerts |
| **F1-Score** | **0.3287** | Harmonic mean reflecting imbalanced disaster risk target |

---

## 5. Directory Structure

```text
ml/
├── data/                      # Dataset documentation and raw data references
├── notebooks/
│   ├── exploration.ipynb      # Jupyter exploration notebook
│   └── confusion_matrix.png   # Saved confusion matrix plot
├── src/
│   ├── data_loader.py         # Multi-state HF IndLands zip dataset loader
│   ├── preprocessing.py      # ColumnTransformer & StandardScaler pipeline
│   ├── feature_engineering.py# Derived terrain-moisture interaction features
│   ├── train.py               # SVM training & GridSearchCV hyperparameter search
│   ├── evaluate.py            # Classification metrics & matrix visualization
│   └── predict.py             # Inference predictor & risk categorization engine
├── models/
│   ├── landslide_svm_pipeline.pkl # Serialized scikit-learn pipeline artifact
│   ├── model_metrics.json     # Saved evaluation metrics JSON
│   └── confusion_matrix.png   # Heatmap visualization
├── api/
│   ├── app.py                 # FastAPI prediction server
│   └── static/                # Interactive Early Warning Web Dashboard
│       ├── index.html         # Modern dark-mode dashboard UI
│       ├── styles.css         # Glassmorphism styling & visual indicators
│       └── main.js            # Live risk gauge controller & IoT simulator
├── requirements.txt
└── README.md
```
