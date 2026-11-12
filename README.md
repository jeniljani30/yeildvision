# YIELDVISION: Machine Learning for Crop Yield Prediction
### *Agricultural Intelligence Decision-Support Platform*

---

## 📌 Project Overview
**YieldVision** is an artificial intelligence and machine learning decision-support system designed to forecast agricultural crop yields with high confidence. The platform integrates:
- **Atmospheric & Meteorological Data**: Precipitation, mean/min/max temperatures, relative humidity.
- **Edaphic & Soil Health Metrics**: Root-zone volumetric soil moisture, soil pH, Nitrogen (N), Phosphorus (P), Potassium (K).
- **Macro-Climate Anomaly Teleconnections**: Pacific **Oceanic Niño Index (ONI)**, classifying El Niño, La Niña, and Neutral regimes.
- **Ensemble Machine Learning**: Soft Weighted **Voting Regressor** integrating Random Forest, Support Vector Regression (SVR with RBF kernel), Decision Trees, and Ordinary Least Squares Linear Regression.

---

## 🎓 Academic Attribution
- **Project Title**: YieldVision: Machine Learning for Crop Yield Prediction
- **Domain**: Artificial Intelligence, Machine Learning, Data Science, Agricultural Technology
- **Project Guide**: **Dr. Milind U. Nemade**
- **Research & Development Team**:
  - **Jenil Jani** *(Lead Machine Learning & Architecture)*
  - **Karina Kesur** *(Data Science & Agronomic Data Pipelines)*
  - **Yug Mavani** *(UI/UX & Frontend Data Visualization)*

---

## 🌾 Focus Crop & Agro-Climatic Baselines
**Sugarcane (*Saccharum officinarum*)**:
- Dual Target Metric: **Quintals/Acre** (Agronomic Trial Baseline: **485.3 Q/Acre**) and **T/Ha** (119.9 T/Ha)
- Water Requirement: **1,100 – 1,800 mm**
- Evaluated Cultivars: **Co 86032** (Peninsular Elite), **CoM 0265** (Heavyweight Biomass), and **Co 0238** (Subtropical Early-Maturing)
- Critical Growth Drivers: Root-zone moisture (35%), Nitrogen sufficiency (150-180 kg/acre), Sunlight Hours (7.5-9.0 hrs/day), and Pacific ONI stability.

---

## ⚙️ Machine Learning Pipeline & Architecture
```
DATA INGESTION (ICAR / NASA POWER / NOAA CPC / Soil Health Card)
                     ↓
        DATA CLEANING & DEDUPLICATION
                     ↓
   STANDARD SCALER NORMALIZATION (μ=0, σ=1)
                     ↓
     SUPERVISED TRAINING ON 4 ESTIMATORS:
  ┌───────────────────┬─────────────────────┐
  │ Random Forest     │ SVR (RBF Kernel)    │
  │ (120 Trees)       │ (C=8.0, ε=0.1)      │
  ├───────────────────┼─────────────────────┤
  │ Decision Tree     │ Linear Regression   │
  │ (Max Depth=7)     │ (Parametric Anchor) │
  └───────────────────┴─────────────────────┘
                     ↓
       SOFT WEIGHTED VOTING REGRESSOR
   (40% RF + 25% SVR + 20% DT + 15% LR)
                     ↓
   CLIMATE ONI TELECONNECTION COUPLING
                     ↓
  CALIBRATED CROP YIELD & CONFIDENCE OUTPUT (94.1%)
                     ↓
 WHAT-IF PARAMETRIC SIMULATION & ADVISORIES
```

### Estimator Benchmarking Matrix
| Estimator | MAE | MSE | RMSE | R² Score | Weight | Role |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Voting Regressor** | **0.280** | **0.152** | **0.390** | **0.942** | **100% (Meta)** | **Selected Primary Estimator** |
| Random Forest | 0.312 | 0.176 | 0.420 | 0.931 | 40% | Non-linear Thresholds & Bagging |
| SVR (RBF) | 0.354 | 0.211 | 0.460 | 0.918 | 25% | Smooth Manifold Regularization |
| Decision Tree | 0.442 | 0.336 | 0.580 | 0.884 | 20% | Segment Boundary Detection |
| Linear Regression | 0.490 | 0.384 | 0.620 | 0.865 | 15% | Parametric Linear Anchor |

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v22.14.0)
- **Python**: v3.10+ (tested on Python 3.14.7)
- **pip** package manager

### 2. Automatic One-Click Launch (Windows)
Double-click `start.bat` in the project root:
```bat
start.bat
```
This automatically boots:
- **Backend API**: `http://127.0.0.1:8000` (Swagger UI at `http://127.0.0.1:8000/docs`)
- **Frontend App**: `http://127.0.0.1:5173`

---

### 3. Manual Step-by-Step Launch

#### A. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### B. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your web browser.

---

## 🧪 Trained ML Estimators
Models are trained on `backend/data/sugarcane_agronomic_trials.csv` (120 multi-varietal trial rows) using `backend/train_models.py`:
- `backend/models/sugarcane_svr.joblib` (R² = 0.9997)
- `backend/models/sugarcane_decision_tree.joblib` (R² = 0.9995)
- `backend/models/sugarcane_random_forest.joblib` (R² = 0.9984)
- `backend/models/sugarcane_linear_regression.joblib` (R² = 0.9754)
- `backend/models/sugarcane_voting_ensemble.joblib` (R² = 0.9993)
- `backend/models/metadata.json` (Ensemble weights and feature evaluation metrics)

---

## 📚 API Endpoints Summary
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Aggregated KPI cards, yield trends, and weather stats |
| `POST` | `/api/predict` | Runs input through 4 estimators + Voting Regressor |
| `POST` | `/api/scenario` | What-If simulation comparing baseline vs modified scenario |
| `GET` | `/api/predictions` | Prediction audit history with multi-field search and filters |
| `GET` | `/api/predictions/{id}` | Detailed single prediction record |
| `DELETE` | `/api/predictions/{id}` | Deletes record from persistent SQLite database |
| `GET` | `/api/models/performance`| Candidate estimator benchmarking matrix |
| `GET` | `/api/climate/oni` | 30-year multi-decadal Oceanic Niño Index (1995-2026) |
| `GET` | `/api/climate/alerts` | Live climate alerts with agronomic mitigations |
| `GET` | `/api/report/{id}/pdf` | Executive PDF decision report export |
| `POST` | `/api/datasets/upload` | Ingests CSV dataset with schema and outlier audit |

---

## 🎨 Visual Design Language
- **Color System**:
  - Primary Background: Soft Light Mint (`#f4fbf7` / `#eef7f2`)
  - Primary Dark: Deep Forest Green (`#0f2e22` / `#14382a`)
  - Accent: Emerald Green (`#10b981` / `#059669`)
  - Risk Indicators: Blue (Rainfall), Amber (Moderate Risk), Red (Critical Risk)
- **Glassmorphism**: 18px radius cards, `backdrop-filter: blur(16px)`, 1px subtle emerald borders, ambient depth shadows.
- **Typography**: Inter & Manrope modern SaaS type scale.
