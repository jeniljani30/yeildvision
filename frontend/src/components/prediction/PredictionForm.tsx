import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PredictionInputs, CropType, ClimatePhase } from '../../types';
import { Tooltip } from '../ui/Tooltip';
import { 
  Sprout, 
  CloudRain, 
  Layers, 
  Globe2, 
  Cpu, 
  RotateCcw, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';
import { initialPredictionInputs } from '../../services/demoData';

interface PredictionFormProps {
  onGenerate: (inputs: PredictionInputs) => void;
  isLoading: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onGenerate, isLoading }) => {
  const { crop, setCrop, location, setLocation, season, setSeason, addToast } = useApp();
  const [formData, setFormData] = useState<PredictionInputs>({
    ...initialPredictionInputs,
    crop,
    location,
    season
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingStep, setLoadingStep] = useState<string>('Analyzing environmental conditions...');

  const handleChange = (field: keyof PredictionInputs, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      
      // Auto-update climate state when ONI changes
      if (field === 'oni_index') {
        const oni = parseFloat(value);
        if (oni >= 0.5) next.climate_state = 'El Niño';
        else if (oni <= -0.5) next.climate_state = 'La Niña';
        else next.climate_state = 'Neutral';
      }
      return next;
    });

    // Clear error for field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.rainfall < 0 || formData.rainfall > 5000) {
      newErrors.rainfall = 'Rainfall must be between 0 and 5000 mm';
    }
    if (formData.temperature < 5 || formData.temperature > 55) {
      newErrors.temperature = 'Temperature must be between 5°C and 55°C';
    }
    if (formData.soil_moisture < 5 || formData.soil_moisture > 90) {
      newErrors.soil_moisture = 'Soil moisture must be between 5% and 90%';
    }
    if (formData.soil_ph < 4.0 || formData.soil_ph > 10.0) {
      newErrors.soil_ph = 'Soil pH must be between 4.0 and 10.0';
    }
    if (formData.nitrogen < 10 || formData.nitrogen > 500) {
      newErrors.nitrogen = 'Nitrogen must be between 10 and 500 kg/ha';
    }
    if (formData.historical_yield <= 0) {
      newErrors.historical_yield = 'Historical yield must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please resolve parameter validation errors before generating', 'warning');
      return;
    }

    // Step-by-step loading animation
    setLoadingStep('Analyzing environmental conditions...');
    setTimeout(() => {
      setLoadingStep('Running ensemble models (RF, SVR, DT, LR)...');
      setTimeout(() => {
        setLoadingStep('Optimizing Voting Regressor weights...');
        setTimeout(() => {
          onGenerate(formData);
        }, 600);
      }, 700);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      ...initialPredictionInputs,
      crop,
      location,
      season
    });
    setErrors({});
    addToast('Parameters reset to regional agronomic baseline', 'info');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECTION A — CROP INFORMATION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-forest-900/60 border border-emerald-500/15 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-forest-900 dark:text-emerald-400 border-b border-emerald-500/10 pb-2.5">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Section A — Crop & Geographic Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Crop Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Crop <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.crop}
              onChange={(e) => {
                const val = e.target.value as CropType;
                handleChange('crop', val);
                setCrop(val);
              }}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="Sugarcane">Sugarcane (Saccharum officinarum)</option>
            </select>
          </div>

          {/* Location State */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.location}
              onChange={(e) => {
                handleChange('location', e.target.value);
                setLocation(e.target.value);
              }}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Punjab">Punjab</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              District
            </label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => handleChange('district', e.target.value)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="e.g. Kolhapur"
            />
          </div>

          {/* Season */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cropping Season
            </label>
            <select
              value={formData.season}
              onChange={(e) => {
                handleChange('season', e.target.value);
                setSeason(e.target.value);
              }}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
            </select>
          </div>

          {/* Historical Yield */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Historical Yield (T/Ha)
              </label>
              <Tooltip content="Past 3-year multi-harvest baseline yield benchmark for calibration." />
            </div>
            <input
              type="number"
              step="0.05"
              value={formData.historical_yield}
              onChange={(e) => handleChange('historical_yield', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {errors.historical_yield && (
              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.historical_yield}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION B — WEATHER PARAMETERS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-forest-900/60 border border-emerald-500/15 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-forest-900 dark:text-emerald-400 border-b border-emerald-500/10 pb-2.5">
          <CloudRain className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Section B — Meteorological Conditions
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Rainfall */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 leading-snug">
                <span>Rainfall (mm) <span className="text-red-500">*</span></span>
                <Tooltip content="Average cumulative precipitation during the crop vegetative and tillering cycles." />
              </label>
            </div>
            <input
              type="number"
              value={formData.rainfall}
              onChange={(e) => handleChange('rainfall', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {errors.rainfall && (
              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.rainfall}
              </p>
            )}
          </div>

          {/* Mean Temperature */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 leading-snug">
                <span>Mean Temperature (°C)</span>
                <Tooltip content="Mean ambient temperature during growing season. Optimal: 25-32°C." />
              </label>
            </div>
            <input
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {errors.temperature && (
              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.temperature}
              </p>
            )}
          </div>

          {/* Humidity */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 leading-snug">
                <span>Relative Humidity (%)</span>
                <Tooltip content="Atmospheric relative humidity level. Standard crop range: 50% - 85%." />
              </label>
            </div>
            <input
              type="number"
              value={formData.humidity}
              onChange={(e) => handleChange('humidity', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Min Temp */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                Min Temperature (°C)
              </label>
            </div>
            <input
              type="number"
              step="0.1"
              value={formData.min_temp ?? 21.2}
              onChange={(e) => handleChange('min_temp', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Max Temp */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                Max Temperature (°C)
              </label>
            </div>
            <input
              type="number"
              step="0.1"
              value={formData.max_temp ?? 34.6}
              onChange={(e) => handleChange('max_temp', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>
      </div>

      {/* SECTION C — SOIL PARAMETERS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-forest-900/60 border border-emerald-500/15 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-forest-900 dark:text-emerald-400 border-b border-emerald-500/10 pb-2.5">
          <Layers className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Section C — Edaphic & Soil Fertility Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Soil Moisture */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 leading-snug">
                <span>Soil Moisture (%) <span className="text-red-500">*</span></span>
                <Tooltip content="Volumetric root-zone moisture percentage. Favorable: 30% - 45%." />
              </label>
            </div>
            <input
              type="number"
              step="0.5"
              value={formData.soil_moisture}
              onChange={(e) => handleChange('soil_moisture', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {errors.soil_moisture && (
              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.soil_moisture}
              </p>
            )}
          </div>

          {/* Soil pH */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 leading-snug">
                <span>Soil pH (4.0 - 10.0)</span>
                <Tooltip content="Soil acidity/alkalinity scale. Optimal: 6.5 - 7.5." />
              </label>
            </div>
            <input
              type="number"
              step="0.1"
              value={formData.soil_ph}
              onChange={(e) => handleChange('soil_ph', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {errors.soil_ph && (
              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.soil_ph}
              </p>
            )}
          </div>

          {/* Nitrogen */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 leading-snug">
                <span>Nitrogen (kg/ha)</span>
                <Tooltip content="Available plant nitrogen. Critical for vegetative canopy and tillering vigor." />
              </label>
            </div>
            <input
              type="number"
              value={formData.nitrogen}
              onChange={(e) => handleChange('nitrogen', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Phosphorus */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                Phosphorus (P, kg/ha)
              </label>
            </div>
            <input
              type="number"
              value={formData.phosphorus}
              onChange={(e) => handleChange('phosphorus', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Potassium */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                Potassium (K, kg/ha)
              </label>
            </div>
            <input
              type="number"
              value={formData.potassium}
              onChange={(e) => handleChange('potassium', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>
      </div>

      {/* SECTION D — CLIMATE PARAMETERS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-forest-900/60 border border-emerald-500/15 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-forest-900 dark:text-emerald-400 border-b border-emerald-500/10 pb-2.5">
          <Globe2 className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Section D — Climate Teleconnection & ONI Indicators
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* ONI Index */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 leading-snug">
                <span>Oceanic Niño Index (ONI)</span>
                <Tooltip content="3-month running mean of ERSST.v5 SST anomalies in Niño 3.4 region (-3.5 to +3.5°C)." />
              </label>
            </div>
            <input
              type="number"
              step="0.05"
              value={formData.oni_index}
              onChange={(e) => handleChange('oni_index', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Climate State */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                Climate State
              </label>
            </div>
            <select
              value={formData.climate_state}
              onChange={(e) => handleChange('climate_state', e.target.value as ClimatePhase)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="Neutral">Neutral (±0.5°C)</option>
              <option value="El Niño">El Niño (&gt; +0.5°C)</option>
              <option value="La Niña">La Niña (&lt; -0.5°C)</option>
            </select>
          </div>

          {/* Anomaly Indicator */}
          <div>
            <div className="flex items-center min-h-[2.25rem] mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                Regional Anomaly Status
              </label>
            </div>
            <input
              type="text"
              value={formData.anomaly_indicator || 'Normal (+0.1°C)'}
              onChange={(e) => handleChange('anomaly_indicator', e.target.value)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons & Loading State */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-forest-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-forest-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Reset to Baseline
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white shadow-lg
            flex items-center justify-center gap-2.5 transition-all cursor-pointer
            ${isLoading
              ? 'bg-forest-800 opacity-90 cursor-wait'
              : 'bg-forest-900 dark:bg-emerald-600 hover:bg-forest-800 dark:hover:bg-emerald-500 hover:shadow-emerald-900/20 hover:-translate-y-0.5'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>{loadingStep}</span>
            </>
          ) : (
            <>
              <Cpu className="w-4 h-4 text-emerald-400 dark:text-forest-950" />
              <span>Generate Prediction</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
