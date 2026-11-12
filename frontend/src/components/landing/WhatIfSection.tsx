import React, { useEffect, useState, useRef } from 'react';
import {
  Sliders,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { apiService } from '../../services/api';

export const WhatIfSection: React.FC = () => {
  // Baseline inputs
  const initialBaseline = {
    rainfall_mm: 1450,
    avg_temperature_celsius: 32.5,
    sunlight_hours_per_day: 8.5,
    nitrogen_n_kg_per_acre: 180,
    phosphorus_p_kg_per_acre: 65,
    potassium_k_kg_per_acre: 80,
    soil_type: 'Alluvial',
    crop_duration_days: 380,
    irrigation_frequency_per_month: 3,
    pest_control_applied: 1,
    seed_variety: 'Co86032',
  };

  const [scenarioParams, setScenarioParams] = useState({ ...initialBaseline });
  const [baselineYield, setBaselineYield] = useState<number>(484.29);
  const [scenarioYield, setScenarioYield] = useState<number>(484.29);
  const [loading, setLoading] = useState(false);
  const [activeScenarioName, setActiveScenarioName] = useState('Current Field Baseline');

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute baseline on mount
  useEffect(() => {
    let isMounted = true;
    async function initBaseline() {
      try {
        const res = await apiService.predictSugarcaneTrial(initialBaseline);
        if (res && res.predicted_yield && isMounted) {
          setBaselineYield(res.predicted_yield);
          setScenarioYield(res.predicted_yield);
        }
      } catch (e) {
        console.warn('Baseline init error:', e);
      }
    }
    initBaseline();
    return () => {
      isMounted = false;
    };
  }, []);

  // Run actual prediction API whenever scenario params change (debounced)
  const runSimulation = (newParams: typeof scenarioParams, scenarioName?: string) => {
    setScenarioParams(newParams);
    if (scenarioName) setActiveScenarioName(scenarioName);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await apiService.predictSugarcaneTrial(newParams);
        if (res && res.predicted_yield !== undefined) {
          setScenarioYield(res.predicted_yield);
        }
      } catch (e) {
        console.warn('Simulation API call failed:', e);
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  const handleSliderChange = (field: string, val: number) => {
    const updated = { ...scenarioParams, [field]: val };
    setActiveScenarioName('Custom Scenario');
    runSimulation(updated);
  };

  // Preset scenarios
  const applyPresetScenario = (name: string, overrides: Partial<typeof scenarioParams>) => {
    const updated = { ...initialBaseline, ...overrides };
    runSimulation(updated, name);
  };

  const deltaYield = Number((scenarioYield - baselineYield).toFixed(2));
  const deltaPercent = Number(
    ((deltaYield / Math.max(1, baselineYield)) * 100).toFixed(2)
  );

  return (
    <section
      id="whatif"
      className="py-24 sm:py-36 px-6 sm:px-8 bg-[#FAFCF9] relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
              SENSITIVITY & SCENARIO ENGINE
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#073B2A] tracking-[-1px] font-normal leading-[1.05]">
            What if the conditions changed?
          </h2>
          <p className="mt-4 text-[#4F5A54] text-base sm:text-lg font-sans max-w-xl mx-auto">
            Test alternative agricultural interventions and weather fluctuations. Every adjustment
            triggers a live execution of the Voting Regressor ensemble.
          </p>

          {/* Quick Scenario Preset Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() =>
                applyPresetScenario('Nitrogen Optimization (+30 kg)', {
                  nitrogen_n_kg_per_acre: 210,
                })
              }
              className="px-3.5 py-1.5 rounded-full text-xs font-sans bg-white border border-[#073B2A]/20 text-[#073B2A] hover:bg-[#DDF5EA] transition-all font-medium shadow-sm"
            >
              +30 kg/Acre Nitrogen
            </button>
            <button
              onClick={() =>
                applyPresetScenario('Monsoon Drought Deficit (-400mm)', {
                  rainfall_mm: 1050,
                  avg_temperature_celsius: 35.0,
                })
              }
              className="px-3.5 py-1.5 rounded-full text-xs font-sans bg-white border border-[#073B2A]/20 text-[#073B2A] hover:bg-[#DDF5EA] transition-all font-medium shadow-sm"
            >
              Severe Monsoon Deficit
            </button>
            <button
              onClick={() =>
                applyPresetScenario('Absent Pest Control Shock', {
                  pest_control_applied: 0,
                })
              }
              className="px-3.5 py-1.5 rounded-full text-xs font-sans bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 transition-all font-medium shadow-sm"
            >
              Omit Pest Spraying (0)
            </button>
            <button
              onClick={() =>
                applyPresetScenario('Extended Maturity (420 Days)', {
                  crop_duration_days: 420,
                  irrigation_frequency_per_month: 4,
                })
              }
              className="px-3.5 py-1.5 rounded-full text-xs font-sans bg-white border border-[#073B2A]/20 text-[#073B2A] hover:bg-[#DDF5EA] transition-all font-medium shadow-sm"
            >
              Adsali Extended Cycle
            </button>
            <button
              onClick={() => applyPresetScenario('Reset to Field Baseline', {})}
              className="px-3.5 py-1.5 rounded-full text-xs font-sans bg-slate-100 text-[#4F5A54] hover:bg-slate-200 transition-all font-medium"
            >
              Reset Baseline
            </button>
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 9 Interactive Parameter Sliders */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-[28px] bg-white/80 backdrop-blur-xl border border-white shadow-[0_12px_40px_rgba(7,59,42,0.06)] text-left space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#073B2A] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#073B2A]" />
                <span>Field Condition Controls</span>
              </span>
              {loading && (
                <span className="text-xs text-[#073B2A] font-medium flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Calculating ML Ensemble...
                </span>
              )}
            </div>

            {/* 1. Rainfall */}
            <div>
              <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                <span>Rainfall (mm)</span>
                <span className="font-semibold text-[#073B2A]">
                  {scenarioParams.rainfall_mm} mm
                </span>
              </div>
              <input
                type="range"
                min={400}
                max={2600}
                step={50}
                value={scenarioParams.rainfall_mm}
                onChange={(e) => handleSliderChange('rainfall_mm', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
              />
            </div>

            {/* 2. Temperature */}
            <div>
              <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                <span>Mean Temperature (°C)</span>
                <span className="font-semibold text-[#073B2A]">
                  {scenarioParams.avg_temperature_celsius}°C
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={45}
                step={0.5}
                value={scenarioParams.avg_temperature_celsius}
                onChange={(e) =>
                  handleSliderChange('avg_temperature_celsius', Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
              />
            </div>

            {/* 3. Sunlight */}
            <div>
              <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                <span>Sunlight Hours / Day</span>
                <span className="font-semibold text-[#073B2A]">
                  {scenarioParams.sunlight_hours_per_day} hrs
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={12}
                step={0.5}
                value={scenarioParams.sunlight_hours_per_day}
                onChange={(e) =>
                  handleSliderChange('sunlight_hours_per_day', Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
              />
            </div>

            {/* 4. Nitrogen (N) */}
            <div>
              <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                <span>Nitrogen (N)</span>
                <span className="font-semibold text-[#073B2A]">
                  {scenarioParams.nitrogen_n_kg_per_acre} kg/acre
                </span>
              </div>
              <input
                type="range"
                min={80}
                max={300}
                step={5}
                value={scenarioParams.nitrogen_n_kg_per_acre}
                onChange={(e) =>
                  handleSliderChange('nitrogen_n_kg_per_acre', Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
              />
            </div>

            {/* 5. Phosphorus (P) */}
            <div>
              <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                <span>Phosphorus (P)</span>
                <span className="font-semibold text-[#073B2A]">
                  {scenarioParams.phosphorus_p_kg_per_acre} kg/acre
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={120}
                step={5}
                value={scenarioParams.phosphorus_p_kg_per_acre}
                onChange={(e) =>
                  handleSliderChange('phosphorus_p_kg_per_acre', Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
              />
            </div>

            {/* 6. Potassium (K) */}
            <div>
              <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                <span>Potassium (K)</span>
                <span className="font-semibold text-[#073B2A]">
                  {scenarioParams.potassium_k_kg_per_acre} kg/acre
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={150}
                step={5}
                value={scenarioParams.potassium_k_kg_per_acre}
                onChange={(e) =>
                  handleSliderChange('potassium_k_kg_per_acre', Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
              />
            </div>

            {/* 7. Crop Duration */}
            <div>
              <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                <span>Crop Duration (Days)</span>
                <span className="font-semibold text-[#073B2A]">
                  {scenarioParams.crop_duration_days} days
                </span>
              </div>
              <input
                type="range"
                min={280}
                max={450}
                step={10}
                value={scenarioParams.crop_duration_days}
                onChange={(e) =>
                  handleSliderChange('crop_duration_days', Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
              />
            </div>

            {/* 8. Irrigation */}
            <div>
              <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-1.5">
                <span>Irrigation Frequency</span>
                <span className="font-semibold text-[#073B2A]">
                  {scenarioParams.irrigation_frequency_per_month} cycles/mo
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={1}
                value={scenarioParams.irrigation_frequency_per_month}
                onChange={(e) =>
                  handleSliderChange('irrigation_frequency_per_month', Number(e.target.value))
                }
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#073B2A]"
              />
            </div>

            {/* 9. Pest Control */}
            <div>
              <div className="flex justify-between items-center text-xs font-sans font-medium text-[#17201C] mb-2">
                <span>Pest Control Protection</span>
                <span className="font-semibold text-[#073B2A]">
                  {scenarioParams.pest_control_applied === 1 ? 'Applied (1)' : 'Omitted (0)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSliderChange('pest_control_applied', 1)}
                  className={`py-2 px-3 rounded-xl text-xs font-sans font-medium transition-all ${
                    scenarioParams.pest_control_applied === 1
                      ? 'bg-[#073B2A] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-[#4F5A54]'
                  }`}
                >
                  ✓ Applied
                </button>
                <button
                  type="button"
                  onClick={() => handleSliderChange('pest_control_applied', 0)}
                  className={`py-2 px-3 rounded-xl text-xs font-sans font-medium transition-all ${
                    scenarioParams.pest_control_applied === 0
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-[#4F5A54]'
                  }`}
                >
                  ✗ Not Applied
                </button>
              </div>
            </div>
          </div>

          {/* Right: Comparative Yield Output Card */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="p-7 sm:p-9 rounded-[28px] bg-white/90 backdrop-blur-2xl border border-white shadow-[0_16px_50px_rgba(7,59,42,0.10)] text-left">
              <div className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#073B2A] mb-1">
                LIVE SCENARIO ANALYSIS
              </div>
              <div className="font-serif text-2xl text-[#17201C] mb-6">
                {activeScenarioName}
              </div>

              {/* Baseline vs Scenario Cards */}
              <div className="space-y-4">
                {/* Baseline */}
                <div className="p-4 rounded-xl bg-[#FAFCF9] border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-sans uppercase tracking-wider text-[#6F6F6F]">
                      BASELINE YIELD
                    </div>
                    <div className="font-serif text-3xl text-[#17201C] mt-0.5">
                      {baselineYield}
                    </div>
                  </div>
                  <div className="text-right text-xs text-[#6F6F6F] font-sans">
                    Quintal / Acre
                  </div>
                </div>

                {/* Scenario Result */}
                <div className="p-5 rounded-2xl bg-[#073B2A] text-white shadow-lg flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-sans uppercase tracking-wider text-emerald-300">
                      SCENARIO YIELD
                    </div>
                    <div className="font-serif text-4xl text-white mt-0.5">
                      {scenarioYield}
                    </div>
                    <div className="text-[11px] text-emerald-200 font-sans mt-0.5">
                      ≈ {(scenarioYield * 0.2471).toFixed(2)} Tonnes / Hectare
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase font-sans text-emerald-300 block">
                      Ensemble Output
                    </span>
                  </div>
                </div>
              </div>

              {/* Delta Comparison */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  {/* Absolute Change */}
                  <div className="p-4 rounded-xl bg-[#F2FAF5] border border-[#073B2A]/10 text-left">
                    <div className="text-[10px] font-sans uppercase tracking-wider text-[#6F6F6F]">
                      ABSOLUTE CHANGE
                    </div>
                    <div
                      className={`font-serif text-2xl font-normal mt-1 flex items-center gap-1 ${
                        deltaYield > 0
                          ? 'text-emerald-700'
                          : deltaYield < 0
                          ? 'text-rose-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {deltaYield > 0 ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : deltaYield < 0 ? (
                        <TrendingDown className="w-5 h-5" />
                      ) : null}
                      <span>
                        {deltaYield > 0 ? `+${deltaYield}` : deltaYield} Q/Acre
                      </span>
                    </div>
                  </div>

                  {/* Percentage Change */}
                  <div className="p-4 rounded-xl bg-[#F2FAF5] border border-[#073B2A]/10 text-left">
                    <div className="text-[10px] font-sans uppercase tracking-wider text-[#6F6F6F]">
                      PERCENTAGE DELTA
                    </div>
                    <div
                      className={`font-serif text-2xl font-normal mt-1 ${
                        deltaPercent > 0
                          ? 'text-emerald-700'
                          : deltaPercent < 0
                          ? 'text-rose-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {deltaPercent > 0 ? `+${deltaPercent}%` : `${deltaPercent}%`}
                    </div>
                  </div>
                </div>

                {/* Risk Diagnostic note */}
                <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-[#4F5A54] font-sans leading-relaxed">
                  {deltaPercent >= 0 ? (
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                      Favorable agronomic shift projected by the Voting Regressor ensemble.
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-800">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      Stress conditions detected: yield reduction expected under these parameters.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
