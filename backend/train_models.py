"""
YieldVision — Sugarcane Yield Prediction Model Training Pipeline
Trains 5 regressors on backend/data/DATASET(1).csv:
1. Linear Regression
2. Decision Tree Regressor
3. Random Forest Regressor
4. Support Vector Regressor (SVR)
5. Voting Regressor (Weighted Ensemble)

Target: yield_quintal_per_acre
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, VotingRegressor
from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "DATASET(1).csv")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

def train_and_save():
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    print(f"Loading dataset from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)
    
    # Strip any whitespace from column names
    df.columns = [c.strip() for c in df.columns]
    
    numeric_features = [
        'rainfall_mm', 'avg_temperature_celsius', 'sunlight_hours_per_day',
        'nitrogen_n_kg_per_acre', 'phosphorus_p_kg_per_acre', 'potassium_k_kg_per_acre',
        'crop_duration_days', 'irrigation_frequency_per_month', 'pest_control_applied'
    ]
    categorical_features = ['soil_type', 'seed_variety']
    target_col = 'yield_quintal_per_acre'
    
    X = df[numeric_features + categorical_features]
    y = df[target_col]
    
    print(f"Dataset Shape: {df.shape} (Rows: {len(df)}, Features: {X.shape[1]})")
    
    # Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ]
    )
    
    # 80/20 train/test split with fixed random_state for strict reproducibility
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"Train samples: {len(X_train)}, Test samples: {len(X_test)}")
    
    # Fit preprocessor on train
    preprocessor.fit(X_train)
    joblib.dump(preprocessor, os.path.join(MODELS_DIR, "preprocessor.joblib"))
    
    # 1. Linear Regression Pipeline
    lr_pipe = Pipeline([
        ('prep', preprocessor),
        ('reg', LinearRegression())
    ])
    lr_pipe.fit(X_train, y_train)
    joblib.dump(lr_pipe, os.path.join(MODELS_DIR, "linear_regression.joblib"))
    
    # 2. Decision Tree Pipeline
    dt_pipe = Pipeline([
        ('prep', preprocessor),
        ('reg', DecisionTreeRegressor(random_state=42))
    ])
    dt_pipe.fit(X_train, y_train)
    joblib.dump(dt_pipe, os.path.join(MODELS_DIR, "decision_tree.joblib"))
    
    # 3. Random Forest Pipeline
    rf_pipe = Pipeline([
        ('prep', preprocessor),
        ('reg', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    rf_pipe.fit(X_train, y_train)
    joblib.dump(rf_pipe, os.path.join(MODELS_DIR, "random_forest.joblib"))
    
    # 4. SVR Pipeline
    svr_pipe = Pipeline([
        ('prep', preprocessor),
        ('reg', SVR(kernel='rbf', C=100.0, epsilon=1.0))
    ])
    svr_pipe.fit(X_train, y_train)
    joblib.dump(svr_pipe, os.path.join(MODELS_DIR, "svr.joblib"))
    
    # 5. Weighted Voting Regressor
    # Weights calibrated to estimator performance
    voting_weights = [0.45, 0.25, 0.20, 0.10] # SVR, DT, RF, LR
    voting_pipe = VotingRegressor(
        estimators=[
            ('svr', svr_pipe),
            ('dt', dt_pipe),
            ('rf', rf_pipe),
            ('lr', lr_pipe)
        ],
        weights=voting_weights
    )
    voting_pipe.fit(X_train, y_train)
    joblib.dump(voting_pipe, os.path.join(MODELS_DIR, "voting_regressor.joblib"))
    
    # Evaluate all models on held-out test set
    models = {
        "Linear Regression": lr_pipe,
        "Decision Tree": dt_pipe,
        "Random Forest": rf_pipe,
        "Support Vector Regressor (SVR)": svr_pipe,
        "Voting Regressor": voting_pipe
    }
    
    evaluations = {}
    best_r2 = -1.0
    best_model_name = ""
    
    for name, model in models.items():
        y_pred = model.predict(X_test)
        mae = float(mean_absolute_error(y_test, y_pred))
        mse = float(mean_squared_error(y_test, y_pred))
        rmse = float(np.sqrt(mse))
        r2 = float(r2_score(y_test, y_pred))
        
        evaluations[name] = {
            "mae": round(mae, 3),
            "mse": round(mse, 3),
            "rmse": round(rmse, 3),
            "r2": round(r2, 4)
        }
        
        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name
            
        print(f"{name:30s} -> MAE: {mae:6.3f} | MSE: {mse:8.3f} | RMSE: {rmse:6.3f} | R2: {r2:.4f}")
        
    # Feature importances from Random Forest
    rf_model = rf_pipe.named_steps['reg']
    cat_names = preprocessor.named_transformers_['cat'].get_feature_names_out(categorical_features).tolist()
    all_feature_names = numeric_features + cat_names
    raw_importances = rf_model.feature_importances_
    
    # Aggregate one-hot categories back to parent features for agronomic UI display
    feature_importance_dict = {
        'Nitrogen (N)': float(raw_importances[numeric_features.index('nitrogen_n_kg_per_acre')]),
        'Crop Duration': float(raw_importances[numeric_features.index('crop_duration_days')]),
        'Pest Control': float(raw_importances[numeric_features.index('pest_control_applied')]),
        'Phosphorus (P)': float(raw_importances[numeric_features.index('phosphorus_p_kg_per_acre')]),
        'Potassium (K)': float(raw_importances[numeric_features.index('potassium_k_kg_per_acre')]),
        'Rainfall': float(raw_importances[numeric_features.index('rainfall_mm')]),
        'Sunlight Hours': float(raw_importances[numeric_features.index('sunlight_hours_per_day')]),
        'Avg Temperature': float(raw_importances[numeric_features.index('avg_temperature_celsius')]),
        'Irrigation Frequency': float(raw_importances[numeric_features.index('irrigation_frequency_per_month')]),
        'Soil Type': float(sum(raw_importances[len(numeric_features):len(numeric_features)+len(preprocessor.named_transformers_['cat'].categories_[0])])),
        'Seed Variety': float(sum(raw_importances[-len(preprocessor.named_transformers_['cat'].categories_[1]):]))
    }
    
    # Normalize to 1.0
    tot_imp = sum(feature_importance_dict.values())
    feature_importance_list = [
        {"feature": k, "importance": round(v / tot_imp, 4)}
        for k, v in sorted(feature_importance_dict.items(), key=lambda x: x[1], reverse=True)
    ]
    
    metadata = {
        "dataset_name": "DATASET(1).csv",
        "crop": "Sugarcane",
        "target": target_col,
        "target_unit": "quintal/acre",
        "total_rows": len(df),
        "total_columns": df.shape[1],
        "train_rows": len(X_train),
        "test_rows": len(X_test),
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "soil_types": df['soil_type'].unique().tolist(),
        "seed_varieties": df['seed_variety'].unique().tolist(),
        "evaluations": evaluations,
        "best_model": best_model_name,
        "voting_weights": {"SVR": 0.45, "Decision Tree": 0.25, "Random Forest": 0.20, "Linear Regression": 0.10},
        "feature_importances": feature_importance_list,
        "training_timestamp": datetime.now().isoformat(),
        "random_state": 42
    }
    
    meta_path = os.path.join(MODELS_DIR, "metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"\nTraining complete! Models and metadata saved to {MODELS_DIR}")
    print(f"Best model: {best_model_name} (R2 = {best_r2:.4f})")
    return metadata

if __name__ == "__main__":
    train_and_save()
