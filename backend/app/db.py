import os
import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "yieldvision.db")

def get_supabase_info() -> Dict[str, Any]:
    supabase_url = os.getenv("SUPABASE_URL", "https://pelorvbgtmjcrtsyjalj.supabase.co")
    supabase_key = os.getenv("SUPABASE_KEY", "sb_publishable_IW_Wwf61-_1vAEph6j5FFQ_93P_tU6w")
    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:[YOUR-PASSWORD]@db.pelorvbgtmjcrtsyjalj.supabase.co:5432/postgres")
    has_pwd = "[YOUR-PASSWORD]" not in db_url
    return {
        "configured": True,
        "project_url": supabase_url,
        "publishable_key_set": bool(supabase_key),
        "publishable_key_prefix": (supabase_key[:16] + "...") if supabase_key else None,
        "direct_postgres_status": "Password configured" if has_pwd else "Awaiting database password",
        "primary_storage": "Supabase Cloud REST + SQLite High-Speed Local Cache",
        "schema_file": "supabase_schema.sql"
    }

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Predictions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        crop TEXT NOT NULL,
        location TEXT NOT NULL,
        district TEXT,
        season TEXT NOT NULL,
        year INTEGER NOT NULL,
        predicted_yield REAL NOT NULL,
        unit TEXT NOT NULL DEFAULT 'Quintal/Acre',
        confidence REAL NOT NULL,
        model_used TEXT NOT NULL,
        climate_state TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        inputs_json TEXT NOT NULL,
        model_outputs_json TEXT NOT NULL,
        feature_importance_json TEXT NOT NULL,
        insights_json TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active'
    )
    """)
    
    # Scenarios Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scenarios (
        id TEXT PRIMARY KEY,
        prediction_id TEXT,
        name TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        crop TEXT NOT NULL,
        predicted_yield REAL NOT NULL,
        delta_yield REAL NOT NULL,
        delta_percent REAL NOT NULL,
        confidence REAL NOT NULL,
        risk_level TEXT NOT NULL,
        parameters_json TEXT NOT NULL
    )
    """)
    
    # Datasets Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS datasets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        source TEXT NOT NULL,
        upload_date TEXT NOT NULL,
        row_count INTEGER NOT NULL,
        column_count INTEGER NOT NULL,
        missing_values INTEGER NOT NULL,
        status TEXT NOT NULL,
        version TEXT NOT NULL,
        columns_json TEXT NOT NULL,
        preview_json TEXT NOT NULL
    )
    """)

    # Check and seed if predictions empty
    cursor.execute("SELECT COUNT(*) FROM predictions WHERE crop = 'Sugarcane'")
    count = cursor.fetchone()[0]
    if count == 0:
        seed_predictions(conn)
        
    cursor.execute("SELECT COUNT(*) FROM datasets")
    d_count = cursor.fetchone()[0]
    if d_count == 0:
        seed_datasets(conn)
        
    conn.commit()
    conn.close()

def seed_predictions(conn):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM predictions")
    
    model_outputs = {
        "Voting Regressor": {"prediction": 484.29, "mae": 2.12, "rmse": 2.79, "r2": 0.9993, "weight": 1.0},
        "Support Vector Regressor (SVR)": {"prediction": 484.30, "mae": 1.58, "rmse": 1.98, "r2": 0.9997, "weight": 0.45},
        "Decision Tree": {"prediction": 485.30, "mae": 1.87, "rmse": 2.48, "r2": 0.9995, "weight": 0.25},
        "Random Forest": {"prediction": 484.38, "mae": 3.20, "rmse": 4.26, "r2": 0.9984, "weight": 0.20},
        "Linear Regression": {"prediction": 481.53, "mae": 11.31, "rmse": 16.82, "r2": 0.9754, "weight": 0.10}
    }
    
    feature_importance = [
        {"feature": "Nitrogen (N)", "importance": 0.199, "category": "Nutrient"},
        {"feature": "Crop Duration", "importance": 0.185, "category": "Management"},
        {"feature": "Phosphorus (P)", "importance": 0.158, "category": "Nutrient"},
        {"feature": "Potassium (K)", "importance": 0.137, "category": "Nutrient"},
        {"feature": "Pest Control", "importance": 0.134, "category": "Management"},
        {"feature": "Rainfall", "importance": 0.069, "category": "Weather"},
        {"feature": "Avg Temperature", "importance": 0.068, "category": "Weather"},
        {"feature": "Sunlight Hours", "importance": 0.029, "category": "Weather"}
    ]
    
    records = [
        (
            "PRED-2025-001",
            "2026-03-24 10:14:00",
            "Sugarcane",
            "Maharashtra",
            "Kolhapur",
            "380 Days Cycle",
            2025,
            485.3,
            "Quintal/Acre",
            96.8,
            "Voting Regressor",
            "Neutral",
            "Stable",
            json.dumps({
                "crop": "Sugarcane", "seed_variety": "Co86032", "soil_type": "Alluvial",
                "rainfall_mm": 1450, "avg_temperature_celsius": 32.5, "sunlight_hours_per_day": 8.5,
                "crop_duration_days": 380, "nitrogen_n_kg_per_acre": 180, "phosphorus_p_kg_per_acre": 65,
                "potassium_k_kg_per_acre": 80, "irrigation_frequency_per_month": 3, "pest_control_applied": 1
            }),
            json.dumps(model_outputs),
            json.dumps(feature_importance),
            json.dumps({
                "summary": "Co86032 in Alluvial soil achieves premier yield benchmark under recommended NPK nutrition.",
                "positive_factors": [
                    "High commercial cane sugar (CCS%) density typical of Co86032 cultivar.",
                    "Alluvial loam provides optimal moisture buffering and root aeration.",
                    "Full integrated pest management prevents internode borer degradation."
                ],
                "risk_factors": ["High summer evapotranspiration requires maintaining 3-week irrigation frequency."],
                "top_influencing_factors": ["Nitrogen (180 kg/acre)", "Crop Duration (380 days)", "Alluvial Loam"],
                "confidence_explanation": "Empirically validated on 120-trial multi-model voting regressor (R² = 0.9993)."
            }),
            "Active"
        ),
        (
            "PRED-2025-002",
            "2026-03-20 14:30:00",
            "Sugarcane",
            "Maharashtra",
            "Pune",
            "395 Days Cycle",
            2025,
            505.1,
            "Quintal/Acre",
            97.4,
            "Voting Regressor",
            "Neutral",
            "Stable",
            json.dumps({
                "crop": "Sugarcane", "seed_variety": "CoM0265", "soil_type": "Clay Loam",
                "rainfall_mm": 1650, "avg_temperature_celsius": 33.1, "sunlight_hours_per_day": 8.8,
                "crop_duration_days": 395, "nitrogen_n_kg_per_acre": 200, "phosphorus_p_kg_per_acre": 75,
                "potassium_k_kg_per_acre": 90, "irrigation_frequency_per_month": 3, "pest_control_applied": 1
            }),
            json.dumps(model_outputs),
            json.dumps(feature_importance),
            json.dumps({
                "summary": "CoM0265 (Phule 265) demonstrates superior stalk tonnage and biomass weight in Clay Loam.",
                "positive_factors": [
                    "Exceptional tillering vigor and thick stalk diameter.",
                    "High nitrogen availability (200 kg/acre) fuels vegetative cane growth."
                ],
                "risk_factors": [],
                "top_influencing_factors": ["Nitrogen (200 kg/acre)", "Clay Loam Soil", "Crop Duration (395 days)"],
                "confidence_explanation": "Ensemble variance across estimators is exceptionally low (σ = 1.15 Q/Acre)."
            }),
            "Active"
        ),
        (
            "PRED-2025-003",
            "2026-03-15 09:45:00",
            "Sugarcane",
            "Uttar Pradesh",
            "Muzaffarnagar",
            "330 Days Cycle",
            2024,
            310.8,
            "Quintal/Acre",
            94.2,
            "Voting Regressor",
            "El Niño",
            "Moderate",
            json.dumps({
                "crop": "Sugarcane", "seed_variety": "Co0238", "soil_type": "Red Soil",
                "rainfall_mm": 950, "avg_temperature_celsius": 28.1, "sunlight_hours_per_day": 7.2,
                "crop_duration_days": 330, "nitrogen_n_kg_per_acre": 120, "phosphorus_p_kg_per_acre": 45,
                "potassium_k_kg_per_acre": 60, "irrigation_frequency_per_month": 2, "pest_control_applied": 1
            }),
            json.dumps(model_outputs),
            json.dumps(feature_importance),
            json.dumps({
                "summary": "Co0238 in Red Soil exhibits moderate yield due to lower seasonal precipitation and shorter 330d cycle.",
                "positive_factors": ["Early sugar accumulation provides respectable sucrose despite shorter cycle."],
                "risk_factors": [
                    "Red soil moisture depletion requires supplementary organic mulching.",
                    "Rainfall (950 mm) was sub-optimal during formative phase."
                ],
                "top_influencing_factors": ["Rainfall (950 mm)", "Red Soil", "Nitrogen (120 kg/acre)"],
                "confidence_explanation": "Validated against subtropical trial benchmarks."
            }),
            "Active"
        ),
        (
            "PRED-2025-004",
            "2026-02-28 16:20:00",
            "Sugarcane",
            "Karnataka",
            "Belagavi",
            "370 Days Cycle",
            2025,
            315.4,
            "Quintal/Acre",
            91.5,
            "Voting Regressor",
            "Neutral",
            "Moderate",
            json.dumps({
                "crop": "Sugarcane", "seed_variety": "Co86032", "soil_type": "Alluvial",
                "rainfall_mm": 1200, "avg_temperature_celsius": 31.5, "sunlight_hours_per_day": 8.1,
                "crop_duration_days": 370, "nitrogen_n_kg_per_acre": 160, "phosphorus_p_kg_per_acre": 60,
                "potassium_k_kg_per_acre": 75, "irrigation_frequency_per_month": 3, "pest_control_applied": 0
            }),
            json.dumps(model_outputs),
            json.dumps(feature_importance),
            json.dumps({
                "summary": "Absence of pest control in Trial #7 caused an estimated 170 Q/Acre loss from stalk borers.",
                "positive_factors": ["Soil fertility and climate were optimal."],
                "risk_factors": ["Unchecked early shoot borer damage severely reduced harvestable stalk density."],
                "top_influencing_factors": ["Pest Control (Absent)", "Nitrogen (160 kg/acre)", "Duration (370 days)"],
                "confidence_explanation": "Model captured significant negative coefficient on pest_control_applied = 0."
            }),
            "Active"
        )
    ]
    
    cursor.executemany("""
    INSERT INTO predictions (
        id, timestamp, crop, location, district, season, year,
        predicted_yield, unit, confidence, model_used, climate_state,
        risk_level, inputs_json, model_outputs_json, feature_importance_json,
        insights_json, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, records)

def seed_datasets(conn):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM datasets")
    
    # 1. Sugarcane Multi-Varietal Agronomic & Yield Trials Dataset (DATA-001)
    # The primary dataset of YieldVision
    datasets = [
        (
            "DATA-001",
            "Sugarcane Multi-Varietal Agronomic & Yield Trials Dataset",
            "ICAR-SBI Sugarcane Breeding Institute & Multi-Location Trials",
            "2026-03-24",
            120,
            12,
            0,
            "Primary Active Dataset (Trained)",
            "v2.0",
            json.dumps([
                "rainfall_mm", "avg_temperature_celsius", "sunlight_hours_per_day",
                "nitrogen_n_kg_per_acre", "phosphorus_p_kg_per_acre", "potassium_k_kg_per_acre",
                "soil_type", "crop_duration_days", "irrigation_frequency_per_month",
                "pest_control_applied", "seed_variety", "yield_quintal_per_acre"
            ]),
            json.dumps([
                {"rainfall_mm": 1450, "avg_temperature_celsius": 32.5, "sunlight_hours_per_day": 8.5, "nitrogen_n_kg_per_acre": 180, "phosphorus_p_kg_per_acre": 65, "potassium_k_kg_per_acre": 80, "soil_type": "Alluvial", "crop_duration_days": 380, "irrigation_frequency_per_month": 3, "pest_control_applied": 1, "seed_variety": "Co86032", "yield_quintal_per_acre": 485.3},
                {"rainfall_mm": 950, "avg_temperature_celsius": 28.1, "sunlight_hours_per_day": 7.2, "nitrogen_n_kg_per_acre": 120, "phosphorus_p_kg_per_acre": 45, "potassium_k_kg_per_acre": 60, "soil_type": "Red Soil", "crop_duration_days": 330, "irrigation_frequency_per_month": 2, "pest_control_applied": 1, "seed_variety": "Co0238", "yield_quintal_per_acre": 310.8},
                {"rainfall_mm": 1100, "avg_temperature_celsius": 30.2, "sunlight_hours_per_day": 7.8, "nitrogen_n_kg_per_acre": 150, "phosphorus_p_kg_per_acre": 55, "potassium_k_kg_per_acre": 70, "soil_type": "Clay Loam", "crop_duration_days": 360, "irrigation_frequency_per_month": 4, "pest_control_applied": 1, "seed_variety": "CoM0265", "yield_quintal_per_acre": 421.5},
                {"rainfall_mm": 1800, "avg_temperature_celsius": 34.0, "sunlight_hours_per_day": 9.0, "nitrogen_n_kg_per_acre": 220, "phosphorus_p_kg_per_acre": 80, "potassium_k_kg_per_acre": 100, "soil_type": "Alluvial", "crop_duration_days": 410, "irrigation_frequency_per_month": 3, "pest_control_applied": 1, "seed_variety": "Co86032", "yield_quintal_per_acre": 540.2},
                {"rainfall_mm": 800, "avg_temperature_celsius": 26.5, "sunlight_hours_per_day": 6.8, "nitrogen_n_kg_per_acre": 100, "phosphorus_p_kg_per_acre": 40, "potassium_k_kg_per_acre": 50, "soil_type": "Sandy Loam", "crop_duration_days": 320, "irrigation_frequency_per_month": 5, "pest_control_applied": 0, "seed_variety": "Co0238", "yield_quintal_per_acre": 195.7}
            ])
        ),
        (
            "DATA-002",
            "NOAA Oceanic Niño Index (ONI) Climate Teleconnection 1990-2026",
            "NOAA Climate Prediction Center (CPC)",
            "2026-03-01",
            432,
            6,
            0,
            "Live Climate Sync",
            "v2026.3",
            json.dumps(["Year", "Season_3Month", "ONI_Value", "Anomaly_C", "Phase", "Classification"]),
            json.dumps([
                {"Year": 2025, "Season_3Month": "DJF", "ONI_Value": -0.45, "Anomaly_C": -0.45, "Phase": "Neutral", "Classification": "Cool Neutral"},
                {"Year": 2025, "Season_3Month": "JFM", "ONI_Value": -0.32, "Anomaly_C": -0.32, "Phase": "Neutral", "Classification": "Neutral"},
                {"Year": 2025, "Season_3Month": "FMA", "ONI_Value": -0.21, "Anomaly_C": -0.21, "Phase": "Neutral", "Classification": "Neutral"}
            ])
        )
    ]
    cursor.executemany("""
    INSERT INTO datasets (
        id, name, source, upload_date, row_count, column_count,
        missing_values, status, version, columns_json, preview_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, datasets)

def reset_db():
    """Resets the SQLite database to clean sugarcane records."""
    conn = get_db()
    seed_predictions(conn)
    seed_datasets(conn)
    conn.commit()
    conn.close()
    print("Database reset and seeded with Sugarcane datasets and predictions.")

if __name__ == "__main__":
    init_db()
    reset_db()
