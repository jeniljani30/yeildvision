from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class PredictRequest(BaseModel):
    crop: str = Field("Sugarcane", description="Target crop: Sugarcane exclusively")
    location: str = Field("Maharashtra", description="State name, e.g. Maharashtra, Uttar Pradesh, Karnataka")
    district: Optional[str] = Field("Kolhapur", description="District name")
    season: str = Field("380 Days Cycle", description="Cropping season or growth cycle")
    year: Optional[int] = Field(2025, description="Year")
    historical_yield: float = Field(485.3, ge=0.1, le=1000.0, description="Historical yield baseline (Quintal/Acre or T/Ha)")
    
    # Weather
    temperature: float = Field(28.4, ge=5.0, le=55.0, description="Mean temperature in °C")
    min_temp: Optional[float] = Field(21.2, ge=0.0, le=45.0, description="Minimum temperature in °C")
    max_temp: Optional[float] = Field(34.6, ge=10.0, le=60.0, description="Maximum temperature in °C")
    rainfall: float = Field(1120.0, ge=0.0, le=5000.0, description="Rainfall in mm")
    humidity: float = Field(68.0, ge=5.0, le=100.0, description="Relative humidity in %")
    
    # Soil
    soil_moisture: float = Field(36.5, ge=5.0, le=90.0, description="Soil moisture in %")
    soil_ph: float = Field(6.8, ge=4.0, le=10.0, description="Soil pH level")
    nitrogen: float = Field(142.0, ge=10.0, le=500.0, description="Nitrogen level in kg/ha")
    phosphorus: float = Field(48.0, ge=5.0, le=250.0, description="Phosphorus level in kg/ha")
    potassium: float = Field(180.0, ge=10.0, le=600.0, description="Potassium level in kg/ha")
    
    # Climate
    oni_index: float = Field(-0.35, ge=-3.5, le=3.5, description="Oceanic Niño Index (-3.5 to +3.5)")
    climate_state: Optional[str] = Field("Neutral", description="El Niño, La Niña, or Neutral")
    anomaly_indicator: Optional[str] = Field("Normal (+0.1°C)", description="Climate anomaly indicator")

class ScenarioRequest(BaseModel):
    baseline_id: Optional[str] = None
    baseline_input: PredictRequest
    scenario_name: str = "Custom Scenario"
    rainfall: float = Field(..., ge=0.0, le=5000.0)
    temperature: float = Field(..., ge=5.0, le=55.0)
    humidity: float = Field(..., ge=5.0, le=100.0)
    soil_moisture: float = Field(..., ge=5.0, le=90.0)
    nitrogen: float = Field(..., ge=10.0, le=500.0)
    phosphorus: float = Field(..., ge=5.0, le=250.0)
    potassium: float = Field(..., ge=10.0, le=600.0)
    oni_index: float = Field(..., ge=-3.5, le=3.5)
    historical_yield: float = Field(..., ge=0.1, le=150.0)

class ModelEvaluation(BaseModel):
    prediction: float
    mae: float
    rmse: float
    r2: float
    weight: float

class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float
    category: str

class InsightsData(BaseModel):
    summary: str
    positive_factors: List[str]
    risk_factors: List[str]
    top_influencing_factors: List[str]
    confidence_explanation: str

class PredictResponse(BaseModel):
    id: str
    timestamp: str
    crop: str
    location: str
    district: Optional[str]
    season: str
    year: int
    predicted_yield: float
    unit: str
    confidence: float
    model_used: str
    climate_state: str
    risk_level: str
    model_outputs: Dict[str, ModelEvaluation]
    feature_importance: List[FeatureImportanceItem]
    insights: InsightsData
    status: str

class ScenarioResponse(BaseModel):
    id: str
    name: str
    baseline_yield: float
    scenario_yield: float
    delta_yield: float
    delta_percent: float
    baseline_confidence: float
    scenario_confidence: float
    risk_level: str
    model_outputs: Dict[str, ModelEvaluation]
    insights: InsightsData

class SugarcaneTrialPredictRequest(BaseModel):
    rainfall_mm: float = Field(1450.0, ge=300.0, le=3000.0, description="Annual / seasonal rainfall in mm")
    avg_temperature_celsius: float = Field(32.5, ge=15.0, le=50.0, description="Average temperature in °C")
    sunlight_hours_per_day: float = Field(8.5, ge=4.0, le=14.0, description="Mean daily sunshine hours")
    nitrogen_n_kg_per_acre: float = Field(180.0, ge=50.0, le=350.0, description="Nitrogen applied in kg/acre")
    phosphorus_p_kg_per_acre: float = Field(65.0, ge=20.0, le=150.0, description="Phosphorus applied in kg/acre")
    potassium_k_kg_per_acre: float = Field(80.0, ge=20.0, le=200.0, description="Potassium applied in kg/acre")
    soil_type: str = Field("Alluvial", description="Alluvial, Red Soil, Clay Loam, or Sandy Loam")
    crop_duration_days: int = Field(380, ge=250, le=500, description="Crop duration from planting to harvest in days")
    irrigation_frequency_per_month: int = Field(3, ge=1, le=10, description="Monthly irrigation events")
    pest_control_applied: int = Field(1, ge=0, le=1, description="1 if pest control applied, 0 otherwise")
    seed_variety: str = Field("Co86032", description="Sugarcane variety: Co86032, Co0238, or CoM0265")

