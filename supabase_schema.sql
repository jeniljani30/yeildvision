-- ==============================================================================
-- YieldVision - Supabase PostgreSQL Schema & RLS Setup
-- Project URL: https://pelorvbgtmjcrtsyjalj.supabase.co
-- Description: Sets up Predictions, Scenarios, and Datasets tables with public anon key access
-- ==============================================================================

-- 1. Predictions Table
CREATE TABLE IF NOT EXISTS public.predictions (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    timestamp TEXT NOT NULL,
    crop TEXT NOT NULL,
    location TEXT NOT NULL,
    district TEXT,
    season TEXT NOT NULL,
    year INTEGER NOT NULL,
    predicted_yield DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL DEFAULT 'Quintal/Acre',
    confidence DOUBLE PRECISION NOT NULL,
    model_used TEXT NOT NULL,
    climate_state TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    inputs_json JSONB NOT NULL,
    model_outputs_json JSONB NOT NULL,
    feature_importance_json JSONB NOT NULL,
    insights_json JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active'
);

-- 2. Scenarios Table (What-If Simulations)
CREATE TABLE IF NOT EXISTS public.scenarios (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    prediction_id TEXT,
    name TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    crop TEXT NOT NULL,
    predicted_yield DOUBLE PRECISION NOT NULL,
    delta_yield DOUBLE PRECISION NOT NULL,
    delta_percent DOUBLE PRECISION NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    risk_level TEXT NOT NULL,
    parameters_json JSONB NOT NULL
);

-- 3. Datasets Table (Agronomic Trials & Climate Metadata)
CREATE TABLE IF NOT EXISTS public.datasets (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    upload_date TEXT NOT NULL,
    row_count INTEGER NOT NULL,
    column_count INTEGER NOT NULL,
    missing_values INTEGER NOT NULL,
    status TEXT NOT NULL,
    version TEXT NOT NULL,
    columns_json JSONB NOT NULL,
    preview_json JSONB NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated roles to SELECT (Read)
CREATE POLICY "Allow public read access on predictions" ON public.predictions
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert on predictions" ON public.predictions
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update on predictions" ON public.predictions
    FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "Allow public delete on predictions" ON public.predictions
    FOR DELETE TO anon, authenticated USING (true);

-- Scenarios Policies
CREATE POLICY "Allow public read access on scenarios" ON public.scenarios
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert on scenarios" ON public.scenarios
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public delete on scenarios" ON public.scenarios
    FOR DELETE TO anon, authenticated USING (true);

-- Datasets Policies
CREATE POLICY "Allow public read access on datasets" ON public.datasets
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert on datasets" ON public.datasets
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Seed Initial Agronomic Trial Data (Sugarcane Benchmark Trials)
INSERT INTO public.predictions (
    id, timestamp, crop, location, district, season, year,
    predicted_yield, unit, confidence, model_used, climate_state,
    risk_level, inputs_json, model_outputs_json, feature_importance_json,
    insights_json, status
) VALUES (
    'PRED-2025-001',
    '2026-03-24 10:14:00',
    'Sugarcane',
    'Maharashtra',
    'Kolhapur',
    '380 Days Cycle',
    2025,
    485.3,
    'Quintal/Acre',
    96.8,
    'Voting Regressor',
    'Neutral',
    'Stable',
    '{"crop": "Sugarcane", "seed_variety": "Co86032", "soil_type": "Alluvial", "rainfall_mm": 1450, "avg_temperature_celsius": 32.5, "sunlight_hours_per_day": 8.5, "crop_duration_days": 380, "nitrogen_n_kg_per_acre": 180, "phosphorus_p_kg_per_acre": 65, "potassium_k_kg_per_acre": 80, "irrigation_frequency_per_month": 3, "pest_control_applied": 1}'::jsonb,
    '{"Voting Regressor": {"prediction": 484.29, "mae": 2.12, "rmse": 2.79, "r2": 0.9993, "weight": 1.0}}'::jsonb,
    '[{"feature": "Nitrogen (N)", "importance": 0.199, "category": "Nutrient"}, {"feature": "Crop Duration", "importance": 0.185, "category": "Management"}]'::jsonb,
    '{"summary": "Co86032 in Alluvial soil achieves premier yield benchmark.", "positive_factors": ["High CCS% density", "Alluvial root aeration"], "risk_factors": []}'::jsonb,
    'Active'
) ON CONFLICT (id) DO NOTHING;
