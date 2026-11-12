import React, { useState } from 'react';
import {
  Sparkles,
  CloudRain,
  Sun,
  Thermometer,
  Layers,
  Sprout,
  Clock,
  ShieldCheck,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart2,
  ArrowRight,
} from 'lucide-react';
import { apiService } from '../../services/api';

export const PredictionExperienceSection: React.FC = () => {
  // Organized Inputs State
  const [formData, setFormData] = useState({
    // Weather
    rainfall_mm: 1450,
    avg_temperature_celsius: 32.5,
    sunlight_hours_per_day: 8.5,
    // Soil & Nutrients
    soil_type: 'Alluvial',
    nitrogen_n_kg_per_acre: 180,
    phosphorus_p_kg_per_acre: 65,
    potassium_k_kg_per_acre: 80,
    // Agricultural Conditions
    seed_variety: 'Co86032',
    crop_duration_days: 380,
    irrigation_frequency_per_month: 3,
    pest_control_applied: 1,
  });

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Field change handler
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Preset scenarios
  const applyPreset = (presetName: string) => {
    if (presetName === 'optimal') {
      setFormData({
        rainfall_mm: 1450,
        avg_temperature_celsius: 32.5,
        sunlight_hours_per_day: 8.5,
        soil_type: 'Alluvial',
        nitrogen_n_kg_per_acre: 180,
        phosphorus_p_kg_per_acre: 65,
        potassium_k_kg_per_acre: 80,
        seed_variety: 'Co86032',
        crop_duration_days: 380,
        irrigation_frequency_per_month: 3,
        pest_control_applied: 1,
      });
    } else if (presetName === 'high_yield') {
      setFormData({
        rainfall_mm: 1650,
        avg_temperature_celsius: 31.0,
        sunlight_hours_per_day: 9.0,
        soil_type: 'Clay Loam',
        nitrogen_n_kg_per_acre: 210,
        phosphorus_p_kg_per_acre: 75,
        potassium_k_kg_per_acre: 95,
        seed_variety: 'Co0238',
        crop_duration_days: 400,
        irrigation_frequency_per_month: 4,
        pest_control_applied: 1,
      });
    } else if (presetName === 'drought_stress') {
      setFormData({
        rainfall_mm: 850,
        avg_temperature_celsius: 37.0,
        sunlight_hours_per_day: 10.5,
        soil_type: 'Sandy Loam',
        nitrogen_n_kg_per_acre: 130,
        phosphorus_p_kg_per_acre: 45,
        potassium_k_kg_per_acre: 60,
        seed_variety: 'CoM0265',
        crop_duration_days: 340,
        irrigation_frequency_per_month: 2,
        pest_control_applied: 0,
      });
    }
  };

  // Call the actual FastAPI backend prediction endpoint
  const handleGeneratePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await apiService.predictSugarcaneTrial(formData);
      if (response && response.predicted_yield !== undefined) {
        setPredictionResult(response);
        // Smooth scroll to result card
        setTimeout(() => {
          document.getElementById('prediction-result')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        throw new Error('Invalid response from prediction engine');
      }
    } catch (err: any) {
      console.error('Prediction failed:', err);
      setErrorMsg('Prediction request failed. Please verify connection to backend service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="prediction"
      className="py-24 sm:py-36 px-6 sm:px-8 bg-[#FAFCF9] relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
              PRECISION YIELD MODELING
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#073B2A] tracking-[-1px] font-normal leading-[1.05]">
            Predict your sugarcane yield.
          </h2>
          <p className="mt-4 text-[#4F5A54] text-base sm:text-lg font-sans max-w-xl mx-auto">
            Input field environmental factors and management variables to execute the calibrated
            five-model ensemble.
          </p>

          {/* Quick Presets */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[#6F6F6F] font-sans font-medium mr-1">Load Preset:</span>
            <button
              type="button"
              onClick={() => applyPreset('optimal')}
              className="px-3 py-1 rounded-full text-xs font-sans bg-white border border-[#073B2A]/20 text-[#073B2A] hover:bg-[#DDF5EA] transition-colors"
            >
              Maharashtra Optimal (Co86032)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('high_yield')}
              className="px-3 py-1 rounded-full text-xs font-sans bg-white border border-[#073B2A]/20 text-[#073B2A] hover:bg-[#DDF5EA] transition-colors"
            >
              High-Input Cultivar (Co0238)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('drought_stress')}
              className="px-3 py-1 rounded-full text-xs font-sans bg-white border border-[#073B2A]/20 text-[#073B2A] hover:bg-[#DDF5EA] transition-colors"
            >
              Moisture Deficit (CoM0265)
            </button>
          </div>
        </div>

        {/* Prediction Form */}
        <form onSubmit={handleGeneratePrediction} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* 1. WEATHER GROUP */}
            <div className="p-7 sm:p-8 rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_35px_rgba(7,59,42,0.04)] text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-[#DDF5EA] flex items-center justify-center text-[#073B2A]">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[#073B2A]">WEATHER</h3>
                    <div className="text-[10px] tracking-wider uppercase font-sans text-[#6F6F6F]">
                      Atmospheric Dynamics
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Rainfall */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-2">
                      <span className="flex items-center gap-1.5">
                        <CloudRain className="w-3.5 h-3.5 text-[#073B2A]" />
                        Annual / Cycle Rainfall
                      </span>
                      <span className="font-semibold text-[#073B2A]">
                        {formData.rainfall_mm} mm
                      </span>
                    </div>
                    <input
                      type="range"
                      min={300}
                      max={3000}
                      step={50}
                      value={formData.rainfall_mm}
                      onChange={(e) => handleChange('rainfall_mm', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
                    />
                    <div className="flex justify-between text-[10px] text-[#6F6F6F] mt-1">
                      <span>300 mm (Arid)</span>
                      <span>3000 mm (Tropical)</span>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-2">
                      <span className="flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-[#073B2A]" />
                        Average Temperature
                      </span>
                      <span className="font-semibold text-[#073B2A]">
                        {formData.avg_temperature_celsius}°C
                      </span>
                    </div>
                    <input
                      type="range"
                      min={15.0}
                      max={48.0}
                      step={0.5}
                      value={formData.avg_temperature_celsius}
                      onChange={(e) => handleChange('avg_temperature_celsius', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
                    />
                    <div className="flex justify-between text-[10px] text-[#6F6F6F] mt-1">
                      <span>15°C (Cool)</span>
                      <span>48°C (Extreme)</span>
                    </div>
                  </div>

                  {/* Sunlight */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-2">
                      <span className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-[#073B2A]" />
                        Sunlight Hours / Day
                      </span>
                      <span className="font-semibold text-[#073B2A]">
                        {formData.sunlight_hours_per_day} hrs
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4.0}
                      max={13.0}
                      step={0.5}
                      value={formData.sunlight_hours_per_day}
                      onChange={(e) => handleChange('sunlight_hours_per_day', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
                    />
                    <div className="flex justify-between text-[10px] text-[#6F6F6F] mt-1">
                      <span>4 hrs (Overcast)</span>
                      <span>13 hrs (Intense)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SOIL & NUTRIENTS GROUP */}
            <div className="p-7 sm:p-8 rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_35px_rgba(7,59,42,0.04)] text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-[#DDF5EA] flex items-center justify-center text-[#073B2A]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[#073B2A]">SOIL & NUTRIENTS</h3>
                    <div className="text-[10px] tracking-wider uppercase font-sans text-[#6F6F6F]">
                      Substrate & Fertilization
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Soil Type Select */}
                  <div>
                    <label className="block text-xs font-sans font-medium text-[#17201C] mb-1.5">
                      Soil Classification
                    </label>
                    <select
                      value={formData.soil_type}
                      onChange={(e) => handleChange('soil_type', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-sans font-medium text-[#17201C] focus:outline-none focus:ring-2 focus:ring-[#073B2A]/30 shadow-sm"
                    >
                      <option value="Alluvial">Alluvial (High Cation Exchange)</option>
                      <option value="Clay Loam">Clay Loam (High Moisture Retention)</option>
                      <option value="Red Soil">Red Soil (Iron-rich Drainage)</option>
                      <option value="Sandy Loam">Sandy Loam (Rapid Permeability)</option>
                    </select>
                  </div>

                  {/* Nitrogen (N) */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                      <span>Nitrogen (N)</span>
                      <span className="font-semibold text-[#073B2A]">
                        {formData.nitrogen_n_kg_per_acre} kg/acre
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={350}
                      step={5}
                      value={formData.nitrogen_n_kg_per_acre}
                      onChange={(e) => handleChange('nitrogen_n_kg_per_acre', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
                    />
                  </div>

                  {/* Phosphorus (P) */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                      <span>Phosphorus (P)</span>
                      <span className="font-semibold text-[#073B2A]">
                        {formData.phosphorus_p_kg_per_acre} kg/acre
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={150}
                      step={5}
                      value={formData.phosphorus_p_kg_per_acre}
                      onChange={(e) => handleChange('phosphorus_p_kg_per_acre', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
                    />
                  </div>

                  {/* Potassium (K) */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                      <span>Potassium (K)</span>
                      <span className="font-semibold text-[#073B2A]">
                        {formData.potassium_k_kg_per_acre} kg/acre
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={200}
                      step={5}
                      value={formData.potassium_k_kg_per_acre}
                      onChange={(e) => handleChange('potassium_k_kg_per_acre', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. AGRICULTURAL CONDITIONS GROUP */}
            <div className="p-7 sm:p-8 rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_35px_rgba(7,59,42,0.04)] text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-[#DDF5EA] flex items-center justify-center text-[#073B2A]">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[#073B2A]">AGRICULTURAL CONDITIONS</h3>
                    <div className="text-[10px] tracking-wider uppercase font-sans text-[#6F6F6F]">
                      Cultivar & Husbandry
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Seed Variety */}
                  <div>
                    <label className="block text-xs font-sans font-medium text-[#17201C] mb-1.5">
                      Seed Cultivar / Variety
                    </label>
                    <select
                      value={formData.seed_variety}
                      onChange={(e) => handleChange('seed_variety', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-sans font-medium text-[#17201C] focus:outline-none focus:ring-2 focus:ring-[#073B2A]/30 shadow-sm"
                    >
                      <option value="Co86032">Co86032 (Nayana - High Sugar & Longevity)</option>
                      <option value="Co0238">Co0238 (Karan 4 - Ultra High Biomass)</option>
                      <option value="CoM0265">CoM0265 (Phule 0265 - Drought Tolerant)</option>
                    </select>
                  </div>

                  {/* Crop Duration */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                      <span>Crop Duration</span>
                      <span className="font-semibold text-[#073B2A]">
                        {formData.crop_duration_days} days
                      </span>
                    </div>
                    <input
                      type="range"
                      min={250}
                      max={500}
                      step={10}
                      value={formData.crop_duration_days}
                      onChange={(e) => handleChange('crop_duration_days', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
                    />
                    <div className="flex justify-between text-[10px] text-[#6F6F6F] mt-1">
                      <span>250d (Eksali)</span>
                      <span>380d (Pre-seasonal)</span>
                      <span>500d (Adsali)</span>
                    </div>
                  </div>

                  {/* Irrigation Frequency */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                      <span>Irrigation Frequency</span>
                      <span className="font-semibold text-[#073B2A]">
                        {formData.irrigation_frequency_per_month} cycles/mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      step={1}
                      value={formData.irrigation_frequency_per_month}
                      onChange={(e) => handleChange('irrigation_frequency_per_month', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
                    />
                  </div>

                  {/* Pest Control */}
                  <div>
                    <label className="block text-xs font-sans font-medium text-[#17201C] mb-2">
                      Pest & Borer Control Applied
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleChange('pest_control_applied', 1)}
                        className={`py-2 px-3 rounded-xl text-xs font-sans font-medium transition-all ${
                          formData.pest_control_applied === 1
                            ? 'bg-[#073B2A] text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-[#4F5A54] hover:bg-slate-50'
                        }`}
                      >
                        ✓ Applied (Protected)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('pest_control_applied', 0)}
                        className={`py-2 px-3 rounded-xl text-xs font-sans font-medium transition-all ${
                          formData.pest_control_applied === 0
                            ? 'bg-rose-700 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-[#4F5A54] hover:bg-slate-50'
                        }`}
                      >
                        ✗ Unapplied (Exposed)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col items-center justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative rounded-full px-12 py-5 text-base font-sans font-semibold bg-[#073B2A] text-white transition-all duration-300 hover:scale-[1.03] hover:bg-[#0B4D38] shadow-[0_12px_36px_rgba(7,59,42,0.28)] hover:shadow-[0_16px_44px_rgba(7,59,42,0.38)] flex items-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Computing Ensemble Regressors...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-300 transition-transform group-hover:rotate-12" />
                  <span>GENERATE PREDICTION</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            {errorMsg && (
              <p className="mt-3 text-sm text-rose-600 font-medium">{errorMsg}</p>
            )}
          </div>
        </form>

        {/* ==================================================
            SECTION 7 — PREDICTION RESULT CARD
            ================================================== */}
        {predictionResult && (
          <div
            id="prediction-result"
            className="mt-16 sm:mt-24 p-8 sm:p-12 rounded-[32px] bg-white/90 backdrop-blur-2xl border border-white shadow-[0_24px_70px_rgba(7,59,42,0.12)] text-left animate-fade-rise"
          >
            {/* Top Bar: Headline & ID */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
                  OFFICIAL PREDICTION REPORT
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#073B2A] mt-1">
                  Ensemble Harvest Projection
                </h3>
              </div>
              <div className="text-right sm:text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF5EA] text-[#073B2A] text-xs font-sans font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Confidence: {predictionResult.confidence}%
                </span>
                <div className="text-[11px] text-[#6F6F6F] mt-1 font-sans">
                  ID: {predictionResult.id}
                </div>
              </div>
            </div>

            {/* Core Hero Metric: Predicted Yield */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
              <div className="lg:col-span-6 p-8 rounded-[24px] bg-[#073B2A] text-white shadow-xl">
                <div className="text-xs uppercase tracking-[0.2em] font-sans text-emerald-300 font-medium mb-2">
                  PREDICTED SUGARCANE YIELD
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-6xl sm:text-7xl font-normal text-white tracking-tight">
                    {predictionResult.predicted_yield}
                  </span>
                  <span className="text-xl sm:text-2xl font-serif text-emerald-200">
                    {predictionResult.unit || 'Quintal / Acre'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-emerald-100/90 font-sans font-medium">
                  Equivalent to ≈{' '}
                  <strong className="text-white">
                    {predictionResult.yield_tonnes_per_hectare ||
                      (predictionResult.predicted_yield * 0.2471).toFixed(2)}{' '}
                    T/Ha
                  </strong>{' '}
                  commercial biomass
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100 font-sans">
                  <span>MODEL APPLIED</span>
                  <span className="font-semibold text-white">{predictionResult.model_used}</span>
                </div>
              </div>

              {/* Agronomic Summary from backend insights */}
              <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-4">
                <div className="p-6 rounded-2xl bg-[#FAFCF9] border border-[#073B2A]/10">
                  <div className="text-xs font-sans font-semibold uppercase tracking-wider text-[#073B2A] mb-2">
                    AGRONOMIC DIAGNOSTIC SUMMARY
                  </div>
                  <p className="text-sm leading-relaxed text-[#17201C] font-sans">
                    {predictionResult.insights?.summary ||
                      'Agronomic conditions are aligned with commercial recovery benchmarks.'}
                  </p>
                </div>

                {predictionResult.insights?.positive_factors?.length > 0 && (
                  <div className="space-y-1.5">
                    {predictionResult.insights.positive_factors.map((factor: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-[#4F5A54] font-sans"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Individual Sub-Model Comparison Breakdown */}
            {predictionResult.model_outputs && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="font-serif text-2xl text-[#073B2A] mb-4">
                  Individual Model Predictions & Calibration
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {Object.entries(predictionResult.model_outputs).map(([name, data]: [string, any]) => (
                    <div
                      key={name}
                      className="p-4 rounded-xl bg-[#FAFCF9] border border-slate-200/80 text-left hover:border-[#073B2A]/40 transition-colors"
                    >
                      <div className="text-[11px] font-sans font-medium text-[#6F6F6F] truncate">
                        {name.replace('Support Vector Regressor (SVR)', 'SVR')}
                      </div>
                      <div className="font-serif text-2xl text-[#073B2A] mt-1">
                        {data.prediction}
                      </div>
                      <div className="text-[10px] text-[#4F5A54] mt-1 font-sans">
                        R²: <strong className="text-[#17201C]">{data.r2}</strong> • RMSE: {data.rmse}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Influencing Features */}
            {predictionResult.feature_importance && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="font-serif text-xl text-[#073B2A] mb-3">
                  Relative Feature Influence Weights
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {predictionResult.feature_importance.slice(0, 4).map((f: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-center text-xs mb-1 font-sans">
                        <span className="font-medium text-[#17201C]">{f.feature}</span>
                        <span className="text-[#073B2A] font-semibold">
                          {(f.importance * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#073B2A] rounded-full"
                          style={{ width: `${Math.min(100, f.importance * 350)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
