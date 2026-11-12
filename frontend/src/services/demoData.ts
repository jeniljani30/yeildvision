import { 
  PredictionRecord, 
  PredictionInputs, 
  ClimateSummary, 
  ONIRecord, 
  ClimateAlert, 
  DatasetItem,
  NotificationItem
} from '../types';

export const initialPredictionInputs: PredictionInputs = {
  crop: 'Sugarcane',
  location: 'Maharashtra',
  district: 'Kolhapur',
  season: '2025-26',
  year: 2025,
  historical_yield: 7.45,
  temperature: 28.4,
  min_temp: 21.2,
  max_temp: 34.6,
  rainfall: 1120.0,
  humidity: 68.0,
  soil_moisture: 36.5,
  soil_ph: 6.8,
  nitrogen: 142.0,
  phosphorus: 48.0,
  potassium: 180.0,
  oni_index: -0.35,
  climate_state: 'Neutral',
  anomaly_indicator: 'Normal (+0.1°C)'
};

export const defaultPrediction: PredictionRecord = {
  id: 'PRED-2025-001',
  timestamp: '2026-03-22 10:14:00',
  crop: 'Sugarcane',
  location: 'Maharashtra',
  district: 'Kolhapur',
  season: '2025-26',
  year: 2025,
  predicted_yield: 7.82,
  unit: 'T/Ha',
  confidence: 94.1,
  model_used: 'Voting Regressor',
  climate_state: 'Neutral',
  risk_level: 'Moderate',
  inputs: initialPredictionInputs,
  model_outputs: {
    'Voting Regressor': { prediction: 7.82, mae: 0.28, rmse: 0.39, r2: 0.942, weight: 1.0 },
    'Random Forest': { prediction: 7.91, mae: 0.31, rmse: 0.42, r2: 0.931, weight: 0.40 },
    'Support Vector Regression (SVR)': { prediction: 7.78, mae: 0.35, rmse: 0.46, r2: 0.918, weight: 0.25 },
    'Decision Tree': { prediction: 7.69, mae: 0.44, rmse: 0.58, r2: 0.884, weight: 0.20 },
    'Linear Regression': { prediction: 7.74, mae: 0.49, rmse: 0.62, r2: 0.865, weight: 0.15 }
  },
  feature_importance: [
    { feature: 'Rainfall', importance: 0.284, category: 'Weather' },
    { feature: 'Soil Moisture', importance: 0.218, category: 'Soil' },
    { feature: 'Temperature', importance: 0.162, category: 'Weather' },
    { feature: 'Historical Yield', importance: 0.114, category: 'Historical' },
    { feature: 'Nitrogen', importance: 0.082, category: 'Nutrient' },
    { feature: 'ONI Index', importance: 0.058, category: 'Climate' },
    { feature: 'Soil pH', importance: 0.038, category: 'Soil' },
    { feature: 'Potassium', importance: 0.026, category: 'Nutrient' },
    { feature: 'Phosphorus', importance: 0.018, category: 'Nutrient' }
  ],
  insights: {
    summary: 'Rainfall and soil moisture are currently favorable, while climate indicators suggest moderate variability across the vegetative stage.',
    positive_factors: [
      'Optimal soil moisture (36.5%) supports active cane tillering and root elongation.',
      'Neutral ONI (-0.35) reduces risk of monsoon disruption in Western Maharashtra.',
      'High nitrogen availability (142 kg/ha) accelerates bio-mass accumulation.'
    ],
    risk_factors: [
      'Maximum daytime temperatures reaching 34.6°C could trigger evapotranspiration stress during grand growth period.',
      'Potassium-phosphorus ratio requires balancing to maximize sucrose concentration.'
    ],
    top_influencing_factors: ['Rainfall (28.4%)', 'Soil Moisture (21.8%)', 'Temperature (16.2%)'],
    confidence_explanation: 'Ensemble variance across estimators is exceptionally low (σ = 0.081), producing an elevated confidence score of 94.1%.'
  },
  status: 'Active'
};

export const samplePredictionsHistory: PredictionRecord[] = [
  defaultPrediction,
  {
    id: 'PRED-2025-002',
    timestamp: '2026-03-18 14:30:00',
    crop: 'Sugarcane',
    location: 'Maharashtra',
    district: 'Pune',
    season: '2025-26',
    year: 2025,
    predicted_yield: 421.5,
    unit: 'Quintal/Acre',
    confidence: 93.8,
    model_used: 'Voting Regressor',
    climate_state: 'Neutral',
    risk_level: 'Stable',
    inputs: {
      ...initialPredictionInputs,
      crop: 'Sugarcane',
      location: 'Maharashtra',
      district: 'Pune',
      seed_variety: 'CoM0265',
      soil_type: 'Clay Loam',
      crop_duration_days: 360,
      irrigation_frequency_per_month: 4,
      pest_control_applied: 1,
      historical_yield: 410.0,
      rainfall: 1100.0,
      rainfall_mm: 1100.0,
      temperature: 30.2,
      avg_temperature_celsius: 30.2,
      sunlight_hours_per_day: 7.8,
      soil_moisture: 35.0,
      nitrogen_n_kg_per_acre: 150.0,
      phosphorus_p_kg_per_acre: 55.0,
      potassium_k_kg_per_acre: 70.0,
      oni_index: -0.2,
      climate_state: 'Neutral'
    },
    model_outputs: {
      'Support Vector Regression (SVR)': { prediction: 422.1, mae: 1.58, rmse: 1.98, r2: 0.9997, weight: 0.45 },
      'Decision Tree': { prediction: 421.5, mae: 1.87, rmse: 2.48, r2: 0.9995, weight: 0.25 },
      'Voting Regressor': { prediction: 421.5, mae: 2.12, rmse: 2.79, r2: 0.9993, weight: 1.0 },
      'Random Forest': { prediction: 420.8, mae: 3.20, rmse: 4.26, r2: 0.9984, weight: 0.20 },
      'Linear Regression': { prediction: 424.3, mae: 11.31, rmse: 16.82, r2: 0.9754, weight: 0.10 }
    },
    feature_importance: [
      { feature: 'Rainfall', importance: 0.324, category: 'Weather' },
      { feature: 'Nitrogen (N)', importance: 0.268, category: 'Nutrient' },
      { feature: 'Sunlight Hours', importance: 0.156, category: 'Weather' },
      { feature: 'Crop Duration', importance: 0.098, category: 'Management' },
      { feature: 'Potassium (K)', importance: 0.054, category: 'Nutrient' },
      { feature: 'Soil Type', importance: 0.042, category: 'Soil' },
      { feature: 'Irrigation Freq', importance: 0.032, category: 'Management' },
      { feature: 'Seed Variety', importance: 0.026, category: 'Management' }
    ],
    insights: {
      summary: 'CoM0265 demonstrates high vegetative tillering efficiency in Clay Loam soil with 4 irrigation cycles per month.',
      positive_factors: [
        'Clay loam water retention accommodates high cane biomass requirements.',
        'Balanced nitrogen application (150 kg/acre) aligns with CoM0265 uptake curve.'
      ],
      risk_factors: [
        'Moderate humidity during ripening may require potassium top-dressing to preserve brix.'
      ],
      top_influencing_factors: ['Rainfall (32.4%)', 'Nitrogen (26.8%)', 'Sunlight Hours (15.6%)'],
      confidence_explanation: 'High ensemble convergence across SVR and Decision Tree models calibrated on sugarcane agronomic trial data.'
    },
    status: 'Active'
  },
  {
    id: 'PRED-2025-003',
    timestamp: '2026-03-10 09:45:00',
    crop: 'Sugarcane',
    location: 'Uttar Pradesh',
    district: 'Muzaffarnagar',
    season: '2024-25',
    year: 2024,
    predicted_yield: 7.35,
    unit: 'T/Ha',
    confidence: 93.4,
    model_used: 'Voting Regressor',
    climate_state: 'El Niño',
    risk_level: 'High',
    inputs: {
      ...initialPredictionInputs,
      location: 'Uttar Pradesh',
      district: 'Muzaffarnagar',
      season: '2024-25',
      year: 2024,
      historical_yield: 7.10,
      rainfall: 890.0,
      temperature: 31.8,
      soil_moisture: 31.2,
      oni_index: 1.25,
      climate_state: 'El Niño'
    },
    model_outputs: {
      'Voting Regressor': { prediction: 7.35, mae: 0.32, rmse: 0.44, r2: 0.934, weight: 1.0 },
      'Random Forest': { prediction: 7.42, mae: 0.34, rmse: 0.46, r2: 0.920, weight: 0.40 },
      'Support Vector Regression (SVR)': { prediction: 7.31, mae: 0.38, rmse: 0.49, r2: 0.910, weight: 0.25 },
      'Decision Tree': { prediction: 7.20, mae: 0.47, rmse: 0.61, r2: 0.871, weight: 0.20 },
      'Linear Regression': { prediction: 7.28, mae: 0.52, rmse: 0.65, r2: 0.854, weight: 0.15 }
    },
    feature_importance: [
      { feature: 'ONI Index', importance: 0.265, category: 'Climate' },
      { feature: 'Rainfall', importance: 0.245, category: 'Weather' },
      { feature: 'Soil Moisture', importance: 0.195, category: 'Soil' },
      { feature: 'Temperature', importance: 0.142, category: 'Weather' },
      { feature: 'Historical Yield', importance: 0.082, category: 'Historical' },
      { feature: 'Nitrogen', importance: 0.041, category: 'Nutrient' },
      { feature: 'Soil pH', importance: 0.015, category: 'Soil' },
      { feature: 'Potassium', importance: 0.010, category: 'Nutrient' },
      { feature: 'Phosphorus', importance: 0.005, category: 'Nutrient' }
    ],
    insights: {
      summary: 'Moderate El Niño thermal spike (+1.25°C) depressed tillering density, moderated by Western Jamuna canal irrigation.',
      positive_factors: [
        'Supplemental tube well and canal supply mitigated acute moisture deficit.',
        'High base soil organic carbon maintained rooting depth.'
      ],
      risk_factors: [
        'El Niño dry spell curtailed internode expansion by approximately 8.5%.',
        'Increased evapotranspiration required two additional irrigation rotations.'
      ],
      top_influencing_factors: ['ONI Index (26.5%)', 'Rainfall (24.5%)', 'Soil Moisture (19.5%)'],
      confidence_explanation: 'Strong alignment with 2023/24 regional El Niño climate anomaly impact data.'
    },
    status: 'Active'
  },
  {
    id: 'PRED-2025-004',
    timestamp: '2026-02-28 16:20:00',
    crop: 'Sugarcane',
    location: 'Karnataka',
    district: 'Belagavi',
    season: '2025-26',
    year: 2025,
    predicted_yield: 492.4,
    unit: 'Quintal/Acre',
    confidence: 94.6,
    model_used: 'Voting Regressor',
    climate_state: 'Neutral',
    risk_level: 'Stable',
    inputs: {
      ...initialPredictionInputs,
      crop: 'Sugarcane',
      location: 'Karnataka',
      district: 'Belagavi',
      seed_variety: 'Co86032',
      soil_type: 'Alluvial',
      crop_duration_days: 380,
      irrigation_frequency_per_month: 3,
      pest_control_applied: 1,
      historical_yield: 480.0,
      rainfall: 1450.0,
      rainfall_mm: 1450.0,
      temperature: 31.0,
      avg_temperature_celsius: 31.0,
      sunlight_hours_per_day: 8.5,
      soil_moisture: 38.0,
      nitrogen_n_kg_per_acre: 180.0,
      phosphorus_p_kg_per_acre: 65.0,
      potassium_k_kg_per_acre: 80.0,
      oni_index: 0.10,
      climate_state: 'Neutral'
    },
    model_outputs: {
      'Support Vector Regression (SVR)': { prediction: 493.1, mae: 1.58, rmse: 1.98, r2: 0.9997, weight: 0.45 },
      'Decision Tree': { prediction: 492.4, mae: 1.87, rmse: 2.48, r2: 0.9995, weight: 0.25 },
      'Voting Regressor': { prediction: 492.4, mae: 2.12, rmse: 2.79, r2: 0.9993, weight: 1.0 },
      'Random Forest': { prediction: 491.8, mae: 3.20, rmse: 4.26, r2: 0.9984, weight: 0.20 },
      'Linear Regression': { prediction: 488.6, mae: 11.31, rmse: 16.82, r2: 0.9754, weight: 0.10 }
    },
    feature_importance: [
      { feature: 'Rainfall', importance: 0.315, category: 'Weather' },
      { feature: 'Nitrogen (N)', importance: 0.272, category: 'Nutrient' },
      { feature: 'Sunlight Hours', importance: 0.160, category: 'Weather' },
      { feature: 'Crop Duration', importance: 0.102, category: 'Management' },
      { feature: 'Potassium (K)', importance: 0.051, category: 'Nutrient' },
      { feature: 'Soil Type', importance: 0.040, category: 'Soil' },
      { feature: 'Irrigation Freq', importance: 0.034, category: 'Management' },
      { feature: 'Seed Variety', importance: 0.026, category: 'Management' }
    ],
    insights: {
      summary: 'Co86032 in alluvial soil under 8.5 sunlight hours/day produces optimal biomass accumulation and sucrose yield.',
      positive_factors: [
        'High solar radiation (8.5 hrs/day) accelerates photosynthesis during grand growth phase.',
        'Alluvial soils provide superior rooting depth and moisture buffering.'
      ],
      risk_factors: [
        'Crop duration exceeding 380 days requires vigilant borer monitoring prior to harvest.'
      ],
      top_influencing_factors: ['Rainfall (31.5%)', 'Nitrogen (27.2%)', 'Sunlight Hours (16.0%)'],
      confidence_explanation: 'Strong model agreement across SVR and Decision Tree pipelines calibrated for Belagavi cane belt.'
    },
    status: 'Active'
  }
];

export const whatIfPresets: Record<string, Partial<PredictionInputs> & { name: string; description: string }> = {
  normal: {
    name: 'Normal Conditions',
    description: 'Historical mean meteorological and edaphic conditions',
    rainfall: 1120,
    temperature: 28.4,
    humidity: 68,
    soil_moisture: 36.5,
    nitrogen: 142,
    phosphorus: 48,
    potassium: 180,
    oni_index: -0.35
  },
  increased_rainfall: {
    name: 'Increased Rainfall (+25%)',
    description: 'Surplus monsoon rainfall simulating enhanced aquifer recharge',
    rainfall: 1400,
    temperature: 27.2,
    humidity: 78,
    soil_moisture: 44.0,
    nitrogen: 142,
    phosphorus: 48,
    potassium: 180,
    oni_index: -0.65
  },
  low_rainfall: {
    name: 'Low Rainfall (-30%)',
    description: 'Monsoon deficit scenario inducing early vegetative water deficit',
    rainfall: 784,
    temperature: 30.5,
    humidity: 55,
    soil_moisture: 26.0,
    nitrogen: 142,
    phosphorus: 48,
    potassium: 180,
    oni_index: 0.45
  },
  high_temperature: {
    name: 'High Temperature (+3.5°C)',
    description: 'Thermal stress heatwave during critical vegetative/tillering phase',
    rainfall: 1050,
    temperature: 32.0,
    humidity: 50,
    soil_moisture: 30.0,
    nitrogen: 142,
    phosphorus: 48,
    potassium: 180,
    oni_index: 0.85
  },
  low_moisture: {
    name: 'Low Soil Moisture (22%)',
    description: 'Prolonged dry spell depleting effective root-zone moisture',
    rainfall: 850,
    temperature: 29.8,
    humidity: 52,
    soil_moisture: 22.0,
    nitrogen: 142,
    phosphorus: 48,
    potassium: 180,
    oni_index: 0.20
  },
  el_nino: {
    name: 'El Niño Scenario (ONI +1.6°C)',
    description: 'Strong Pacific warming event depressing Indian summer monsoon',
    rainfall: 820,
    temperature: 31.2,
    humidity: 54,
    soil_moisture: 27.5,
    nitrogen: 142,
    phosphorus: 48,
    potassium: 180,
    oni_index: 1.60
  },
  la_nina: {
    name: 'La Niña Scenario (ONI -1.4°C)',
    description: 'Strong Pacific cooling phase bringing prolonged monsoon recharge',
    rainfall: 1350,
    temperature: 26.8,
    humidity: 82,
    soil_moisture: 42.0,
    nitrogen: 142,
    phosphorus: 48,
    potassium: 180,
    oni_index: -1.40
  }
};

export const defaultClimateSummary: ClimateSummary = {
  oni_value: -0.35,
  climate_state: 'Neutral',
  climate_variability: 'Moderate (0.32)',
  yield_sensitivity: 'Baseline (±1.5%)',
  rainfall_anomaly: '+1.8% above 30-year normal',
  temperature_anomaly: '+0.2°C above seasonal baseline',
  sea_surface_temp_anomaly: '-0.35°C in Niño 3.4 region (5°N-5°S, 120°-170°W)',
  active_enso_cycle: 'Cycle 2025/2026 Neutral Phase'
};

export const sampleONISeries: ONIRecord[] = [
  { year: 2015, season: 'DJF', date: '2015 DJF', oni_value: 0.6, phase: 'El Niño', description: 'Weak El Niño onset', sugarcane_yield: 7.2, rainfall_anomaly_pct: -6.2 },
  { year: 2015, season: 'MAM', date: '2015 MAM', oni_value: 1.0, phase: 'El Niño', description: 'Moderate El Niño', sugarcane_yield: 7.0, rainfall_anomaly_pct: -9.8 },
  { year: 2015, season: 'JJA', date: '2015 JJA', oni_value: 1.6, phase: 'El Niño', description: 'Strong El Niño', sugarcane_yield: 6.8, rainfall_anomaly_pct: -15.4 },
  { year: 2015, season: 'SON', date: '2015 SON', oni_value: 2.4, phase: 'El Niño', description: 'Super El Niño Peak', sugarcane_yield: 6.6, rainfall_anomaly_pct: -22.8 },
  { year: 2016, season: 'DJF', date: '2016 DJF', oni_value: 2.5, phase: 'El Niño', description: 'Super El Niño', sugarcane_yield: 6.7, rainfall_anomaly_pct: -21.0 },
  { year: 2016, season: 'MAM', date: '2016 MAM', oni_value: 1.2, phase: 'El Niño', description: 'El Niño decay', sugarcane_yield: 7.1, rainfall_anomaly_pct: -10.5 },
  { year: 2016, season: 'JJA', date: '2016 JJA', oni_value: -0.3, phase: 'Neutral', description: 'Neutral transition', sugarcane_yield: 7.3, rainfall_anomaly_pct: 2.0 },
  { year: 2016, season: 'SON', date: '2016 SON', oni_value: -0.7, phase: 'La Niña', description: 'Weak La Niña', sugarcane_yield: 7.5, rainfall_anomaly_pct: 7.5 },
  { year: 2020, season: 'SON', date: '2020 SON', oni_value: -1.2, phase: 'La Niña', description: 'Moderate La Niña', sugarcane_yield: 7.7, rainfall_anomaly_pct: 12.0 },
  { year: 2021, season: 'DJF', date: '2021 DJF', oni_value: -1.0, phase: 'La Niña', description: 'Moderate La Niña', sugarcane_yield: 7.8, rainfall_anomaly_pct: 9.8 },
  { year: 2022, season: 'SON', date: '2022 SON', oni_value: -0.9, phase: 'La Niña', description: 'Triple-dip La Niña', sugarcane_yield: 7.9, rainfall_anomaly_pct: 8.5 },
  { year: 2023, season: 'JJA', date: '2023 JJA', oni_value: 0.9, phase: 'El Niño', description: 'Moderate El Niño', sugarcane_yield: 7.3, rainfall_anomaly_pct: -8.8 },
  { year: 2023, season: 'SON', date: '2023 SON', oni_value: 1.8, phase: 'El Niño', description: 'Strong El Niño', sugarcane_yield: 7.0, rainfall_anomaly_pct: -16.5 },
  { year: 2024, season: 'DJF', date: '2024 DJF', oni_value: 1.8, phase: 'El Niño', description: 'Strong El Niño Peak', sugarcane_yield: 7.1, rainfall_anomaly_pct: -15.8 },
  { year: 2024, season: 'SON', date: '2024 SON', oni_value: -0.3, phase: 'Neutral', description: 'Neutral transition', sugarcane_yield: 7.6, rainfall_anomaly_pct: 3.1 },
  { year: 2025, season: 'DJF', date: '2025 DJF', oni_value: -0.45, phase: 'Neutral', description: 'Cool Neutral', sugarcane_yield: 7.75, rainfall_anomaly_pct: 4.2 },
  { year: 2025, season: 'MAM', date: '2025 MAM', oni_value: -0.35, phase: 'Neutral', description: 'Cool Neutral', sugarcane_yield: 7.82, rainfall_anomaly_pct: 3.5 },
  { year: 2026, season: 'DJF', date: '2026 DJF', oni_value: -0.35, phase: 'Neutral', description: 'Current Projected Neutral', sugarcane_yield: 7.82, rainfall_anomaly_pct: 3.2 }
];

export const sampleClimateAlerts: ClimateAlert[] = [
  {
    id: 'ALT-2026-001',
    title: 'Neutral ENSO State Confirmed',
    severity: 'Stable',
    color: 'green',
    category: 'Climate Index',
    timestamp: '2026-03-25',
    description: 'Niño 3.4 SST anomaly observed at -0.35°C. Conditions remain in ENSO-neutral range with minimal disturbance to pre-monsoon planting schedule.',
    mitigation: 'Maintain standard furrow irrigation schedules; prepare nitrogen top-dressing according to recommended vegetative benchmarks.'
  },
  {
    id: 'ALT-2026-002',
    title: 'Pre-Monsoon Thermal Anomaly (+1.4°C)',
    severity: 'Moderate',
    color: 'amber',
    category: 'Thermal Stress',
    timestamp: '2026-03-24',
    description: 'Elevated daytime maximum temperatures (34.6°C) observed across Deccan Plateau zones, accelerating soil surface evaporation.',
    mitigation: 'Recommend trash mulching in sugarcane rows and drip irrigation intervals adjusted to early morning hours.'
  },
  {
    id: 'ALT-2026-003',
    title: 'Localized Soil Moisture Deficit in Marathwada Cane Belt',
    severity: 'Moderate',
    color: 'amber',
    category: 'Soil Water',
    timestamp: '2026-03-21',
    description: 'Topsoil moisture dropped to 26.5% in Marathwada sugarcane acreage following dry atmospheric winds.',
    mitigation: 'Execute supplemental drip irrigation cycle to safeguard cane tillering and reduce root dehydration.'
  },
  {
    id: 'ALT-2026-004',
    title: 'Model Ensemble Convergence Notice',
    severity: 'Stable',
    color: 'green',
    category: 'Prediction Health',
    timestamp: '2026-03-20',
    description: 'Cross-estimator residual standard deviation is 0.081 T/Ha. Confidence metric calculated at optimal 94.1%.',
    mitigation: 'Predictions qualified for state-level agricultural input procurement planning.'
  }
];

export const sampleDatasets: DatasetItem[] = [
  {
    id: 'DATA-001',
    name: 'Sugarcane Multi-Varietal Agronomic & Yield Trials Dataset',
    source: 'ICAR-SBI Sugarcane Breeding Institute & Multi-Location Trials',
    upload_date: '2026-03-24',
    row_count: 120,
    column_count: 12,
    missing_values: 0,
    status: 'Validated & Active (Trained)',
    version: 'v1.2',
    columns: [
      'rainfall_mm', 'avg_temperature_celsius', 'sunlight_hours_per_day',
      'nitrogen_n_kg_per_acre', 'phosphorus_p_kg_per_acre', 'potassium_k_kg_per_acre',
      'soil_type', 'crop_duration_days', 'irrigation_frequency_per_month',
      'pest_control_applied', 'seed_variety', 'yield_quintal_per_acre'
    ],
    preview: [
      { rainfall_mm: 1450, avg_temperature_celsius: 32.5, sunlight_hours_per_day: 8.5, nitrogen_n_kg_per_acre: 180, phosphorus_p_kg_per_acre: 65, potassium_k_kg_per_acre: 80, soil_type: 'Alluvial', crop_duration_days: 380, irrigation_frequency_per_month: 3, pest_control_applied: 1, seed_variety: 'Co86032', yield_quintal_per_acre: 485.3 },
      { rainfall_mm: 950, avg_temperature_celsius: 28.1, sunlight_hours_per_day: 7.2, nitrogen_n_kg_per_acre: 120, phosphorus_p_kg_per_acre: 45, potassium_k_kg_per_acre: 60, soil_type: 'Red Soil', crop_duration_days: 330, irrigation_frequency_per_month: 2, pest_control_applied: 1, seed_variety: 'Co0238', yield_quintal_per_acre: 310.8 },
      { rainfall_mm: 1100, avg_temperature_celsius: 30.2, sunlight_hours_per_day: 7.8, nitrogen_n_kg_per_acre: 150, phosphorus_p_kg_per_acre: 55, potassium_k_kg_per_acre: 70, soil_type: 'Clay Loam', crop_duration_days: 360, irrigation_frequency_per_month: 4, pest_control_applied: 1, seed_variety: 'CoM0265', yield_quintal_per_acre: 421.5 },
      { rainfall_mm: 1800, avg_temperature_celsius: 34.0, sunlight_hours_per_day: 9.0, nitrogen_n_kg_per_acre: 220, phosphorus_p_kg_per_acre: 80, potassium_k_kg_per_acre: 100, soil_type: 'Alluvial', crop_duration_days: 410, irrigation_frequency_per_month: 3, pest_control_applied: 1, seed_variety: 'Co86032', yield_quintal_per_acre: 540.2 },
      { rainfall_mm: 800, avg_temperature_celsius: 26.5, sunlight_hours_per_day: 6.8, nitrogen_n_kg_per_acre: 100, phosphorus_p_kg_per_acre: 40, potassium_k_kg_per_acre: 50, soil_type: 'Sandy Loam', crop_duration_days: 320, irrigation_frequency_per_month: 5, pest_control_applied: 0, seed_variety: 'Co0238', yield_quintal_per_acre: 195.7 }
    ]
  },
  {
    id: 'DATA-002',
    name: 'NOAA Oceanic Niño Index (ONI) 1990-2026',
    source: 'NOAA Climate Prediction Center (CPC)',
    upload_date: '2026-03-01',
    row_count: 432,
    column_count: 6,
    missing_values: 0,
    status: 'Live Sync Standard',
    version: 'v2026.3',
    columns: ['Year', 'Season_3Month', 'ONI_Value', 'Anomaly_C', 'Phase', 'Classification'],
    preview: [
      { Year: 2025, Season_3Month: 'DJF', ONI_Value: -0.45, Anomaly_C: -0.45, Phase: 'Neutral', Classification: 'Cool Neutral' },
      { Year: 2025, Season_3Month: 'JFM', ONI_Value: -0.32, Anomaly_C: -0.32, Phase: 'Neutral', Classification: 'Neutral' },
      { Year: 2025, Season_3Month: 'FMA', ONI_Value: -0.21, Anomaly_C: -0.21, Phase: 'Neutral', Classification: 'Neutral' }
    ]
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    title: 'Prediction Complete',
    message: 'Voting Regressor ensemble generated prediction for Sugarcane (Kolhapur): 7.82 T/Ha.',
    time: '5m ago',
    read: false,
    type: 'prediction'
  },
  {
    id: 'NOTIF-002',
    title: 'Climate Anomaly Update',
    message: 'Niño 3.4 SST anomaly holds at -0.35°C (Cool Neutral). Favorable monsoon onset conditions.',
    time: '2h ago',
    read: false,
    type: 'climate'
  },
  {
    id: 'NOTIF-003',
    title: 'Model Benchmarking Recalibrated',
    message: 'Voting Regressor R² score achieved 0.942 on latest ICAR sugarcane test partition.',
    time: '1d ago',
    read: true,
    type: 'model'
  }
];
