export type CropType = 'Sugarcane';
export type ClimatePhase = 'El Niño' | 'La Niña' | 'Neutral';
export type RiskLevel = 'Stable' | 'Moderate' | 'High' | 'Critical';

export interface ModelOutputMetrics {
  prediction: number;
  mae: number;
  rmse: number;
  r2: number;
  weight: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  category: 'Weather' | 'Soil' | 'Nutrient' | 'Climate' | 'Historical' | 'Management';
}

export interface ModelInsights {
  summary: string;
  positive_factors: string[];
  risk_factors: string[];
  top_influencing_factors: string[];
  confidence_explanation: string;
}

export interface PredictionInputs {
  crop: CropType;
  location: string;
  district: string;
  season: string;
  year: number;
  historical_yield: number;
  temperature: number;
  min_temp?: number;
  max_temp?: number;
  rainfall: number;
  humidity: number;
  soil_moisture: number;
  soil_ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  oni_index: number;
  climate_state: ClimatePhase;
  anomaly_indicator?: string;
  seed_variety?: string;
  soil_type?: string;
  rainfall_mm?: number;
  avg_temperature_celsius?: number;
  nitrogen_n_kg_per_acre?: number;
  phosphorus_p_kg_per_acre?: number;
  potassium_k_kg_per_acre?: number;
  sunlight_hours_per_day?: number;
  crop_duration_days?: number;
  irrigation_frequency_per_month?: number;
  pest_control_applied?: number;
}

export interface PredictionRecord {
  id: string;
  timestamp: string;
  crop: CropType;
  location: string;
  district: string;
  season: string;
  year: number;
  predicted_yield: number;
  unit: string;
  confidence: number;
  model_used: string;
  climate_state: ClimatePhase;
  risk_level: RiskLevel;
  inputs: PredictionInputs;
  model_outputs: Record<string, ModelOutputMetrics>;
  feature_importance: FeatureImportanceItem[];
  insights: ModelInsights;
  status: string;
}

export interface ScenarioItem {
  id: string;
  name: string;
  baseline_yield: number;
  scenario_yield: number;
  delta_yield: number;
  delta_percent: number;
  baseline_confidence: number;
  scenario_confidence: number;
  risk_level: RiskLevel;
  model_outputs: Record<string, ModelOutputMetrics>;
  insights: ModelInsights;
  parameters: Partial<PredictionInputs>;
}

export interface ClimateSummary {
  oni_value: number;
  climate_state: ClimatePhase;
  climate_variability: string;
  yield_sensitivity: string;
  rainfall_anomaly: string;
  temperature_anomaly: string;
  sea_surface_temp_anomaly: string;
  active_enso_cycle: string;
}

export interface ONIRecord {
  year: number;
  season: string;
  date: string;
  oni_value: number;
  phase: ClimatePhase;
  description: string;
  sugarcane_yield: number;
  rainfall_anomaly_pct: number;
}

export interface ClimateAlert {
  id: string;
  title: string;
  severity: RiskLevel;
  color: 'green' | 'amber' | 'red';
  category: string;
  timestamp: string;
  description: string;
  mitigation: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  source: string;
  upload_date: string;
  row_count: number;
  column_count: number;
  missing_values: number;
  status: string;
  version: string;
  columns: string[];
  preview: Record<string, any>[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'prediction' | 'climate' | 'model' | 'system';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'mr'
  | 'gu'
  | 'pa'
  | 'bn'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'or'
  | 'as';

export interface AppSettings {
  theme: 'light' | 'dark';
  units: 'metric' | 'imperial';
  yieldUnit: string;
  tempUnit: string;
  predictionAlerts: boolean;
  climateAlerts: boolean;
  modelAlerts: boolean;
  emailNotifications: boolean;
  reducedMotion: boolean;
  language: LanguageCode;
  farmerMode: boolean;
}

export interface IndiaSugarcaneOverview {
  total_records: number;
  states: string[];
  unique_districts: number;
  year_range: [number, number];
  total_production: number;
  total_area: number;
  national_yield: number;
  top_states: Array<{
    State_Name: string;
    total_production: number;
    total_area: number;
    records_count: number;
    avg_yield: number;
  }>;
  yearly_trend: Array<{
    Crop_Year: number;
    production: number;
    area: number;
    yield: number;
  }>;
}

export interface IndiaSugarcaneExplorer {
  states: string[];
  districts: string[];
  years: number[];
  seasons: string[];
  selected: {
    state: string;
    district: string;
    year: number;
    season: string;
  };
  metrics: {
    area: number;
    production: number;
    historical_yield: number;
    area_unit: string;
    production_unit: string;
    yield_unit: string;
  };
  timeseries: Array<{
    Crop_Year: number;
    production: number;
    area: number;
    yield: number;
  }>;
}
