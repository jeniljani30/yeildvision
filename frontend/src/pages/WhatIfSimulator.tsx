import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/ui/GlassCard';
import { MetricPill } from '../components/ui/MetricPill';
import { Tooltip } from '../components/ui/Tooltip';
import { whatIfPresets } from '../services/demoData';
import { apiService } from '../services/api';
import { ScenarioItem, PredictionInputs } from '../types';
import { 
  Sliders, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Save, 
  Trash2, 
  RotateCcw, 
  Layers, 
  Info,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { currentPrediction, scenarios, addScenario, removeScenario, addToast } = useApp();
  
  const [activePreset, setActivePreset] = useState<string>('normal');
  const [params, setParams] = useState({
    rainfall: currentPrediction.inputs.rainfall || 1120,
    temperature: currentPrediction.inputs.temperature || 28.4,
    humidity: currentPrediction.inputs.humidity || 68,
    soil_moisture: currentPrediction.inputs.soil_moisture || 36.5,
    nitrogen: currentPrediction.inputs.nitrogen || 142,
    phosphorus: currentPrediction.inputs.phosphorus || 48,
    potassium: currentPrediction.inputs.potassium || 180,
    oni_index: currentPrediction.inputs.oni_index || -0.35,
    historical_yield: currentPrediction.inputs.historical_yield || 7.45
  });

  const [scenarioResult, setScenarioResult] = useState<{
    scenario_yield: number;
    delta_yield: number;
    delta_percent: number;
    confidence: number;
    risk_level: string;
    model_outputs: any;
    insights: any;
  }>({
    scenario_yield: 8.31,
    delta_yield: 0.49,
    delta_percent: 6.3,
    confidence: 94.8,
    risk_level: 'Stable',
    model_outputs: currentPrediction.model_outputs,
    insights: currentPrediction.insights
  });

  const [scenarioName, setScenarioName] = useState<string>('Optimal Monsoon Recharge');

  // Trigger recalculation when slider values change
  useEffect(() => {
    let isMounted = true;
    apiService.simulateScenario(currentPrediction.inputs, params, scenarioName).then(res => {
      if (isMounted) {
        setScenarioResult({
          scenario_yield: res.scenario_yield,
          delta_yield: res.delta_yield,
          delta_percent: res.delta_percent,
          confidence: res.scenario_confidence,
          risk_level: res.risk_level,
          model_outputs: res.model_outputs,
          insights: res.insights
        });
      }
    });
    return () => { isMounted = false; };
  }, [params]);

  const handlePresetSelect = (presetKey: string) => {
    setActivePreset(presetKey);
    const preset = whatIfPresets[presetKey];
    if (preset) {
      setParams(prev => ({
        ...prev,
        rainfall: preset.rainfall ?? prev.rainfall,
        temperature: preset.temperature ?? prev.temperature,
        humidity: preset.humidity ?? prev.humidity,
        soil_moisture: preset.soil_moisture ?? prev.soil_moisture,
        nitrogen: preset.nitrogen ?? prev.nitrogen,
        phosphorus: preset.phosphorus ?? prev.phosphorus,
        potassium: preset.potassium ?? prev.potassium,
        oni_index: preset.oni_index ?? prev.oni_index
      }));
      setScenarioName(preset.name);
      addToast(`Applied preset: ${preset.name}`, 'info');
    }
  };

  const handleSliderChange = (key: string, val: number) => {
    setActivePreset('custom');
    setParams(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveScenario = () => {
    const item: ScenarioItem = {
      id: `SCEN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      name: scenarioName || 'Custom Simulation',
      baseline_yield: currentPrediction.predicted_yield,
      scenario_yield: scenarioResult.scenario_yield,
      delta_yield: scenarioResult.delta_yield,
      delta_percent: scenarioResult.delta_percent,
      baseline_confidence: currentPrediction.confidence,
      scenario_confidence: scenarioResult.confidence,
      risk_level: scenarioResult.risk_level as any,
      model_outputs: scenarioResult.model_outputs,
      insights: scenarioResult.insights,
      parameters: params
    };
    addScenario(item);
  };

  const isPositiveDelta = scenarioResult.delta_yield >= 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#064E3B] dark:text-emerald-400 mb-1">
            <span>• INDIA</span>
            <span>•</span>
            <span>SCENARIO SIMULATION</span>
            <span>•</span>
            <span>WHAT-IF ENGINE •</span>
          </div>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl text-[#064E3B] dark:text-white tracking-tight leading-tight">
            What-If Yield Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#65756E] dark:text-slate-400 mt-1 font-sans">
            Simulate environmental and climate fluctuations to observe real-time yield shifts and model responses.
          </p>
        </div>

        {/* Save Scenario Button */}
        <button
          onClick={handleSaveScenario}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-forest-900 dark:bg-emerald-600 hover:bg-forest-800 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-emerald-400 dark:text-forest-950" />
          <span>Save Current Scenario</span>
        </button>
      </div>

      {/* TOP COMPARISON CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Baseline Yield */}
        <GlassCard padding="md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Current Baseline Prediction
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-forest-900 dark:text-white">
              {currentPrediction.predicted_yield}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {currentPrediction.unit}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Model: {currentPrediction.model_used} • Confidence: {currentPrediction.confidence}%
          </p>
        </GlassCard>

        {/* Scenario Prediction */}
        <GlassCard padding="md" className="border-emerald-500/40 ring-1 ring-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Scenario Prediction
            </span>
            <MetricPill label={scenarioResult.risk_level} variant={scenarioResult.risk_level === 'High' ? 'red' : scenarioResult.risk_level === 'Moderate' ? 'amber' : 'emerald'} size="sm" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-forest-900 dark:text-white">
              {scenarioResult.scenario_yield}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {currentPrediction.unit}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Confidence: {scenarioResult.confidence}% • Dynamic Recalculation
          </p>
        </GlassCard>

        {/* Projected Difference Delta */}
        <GlassCard padding="md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Yield Variance Difference
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-black ${isPositiveDelta ? 'text-emerald-600' : 'text-red-500'}`}>
              {isPositiveDelta ? `+${scenarioResult.delta_yield}` : scenarioResult.delta_yield}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {currentPrediction.unit}
            </span>
            <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${isPositiveDelta ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {isPositiveDelta ? `+${scenarioResult.delta_percent}%` : `${scenarioResult.delta_percent}%`}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
            {isPositiveDelta ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
            <span>Compared to regional 5-year average</span>
          </div>
        </GlassCard>
      </div>

      {/* PRESET SCENARIOS BAR */}
      <GlassCard padding="sm" className="space-y-2">
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Presets & Environmental Scenarios
          </span>
          <span className="text-[11px] text-slate-400">Select preset to populate sliders</span>
        </div>

        <div className="flex flex-wrap gap-2 p-1">
          {Object.entries(whatIfPresets).map(([key, preset]) => {
            const isSelected = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => handlePresetSelect(key)}
                className={`
                  px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${isSelected
                    ? 'bg-forest-900 dark:bg-emerald-600 text-white shadow-md'
                    : 'bg-white/80 dark:bg-forest-900/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-forest-800 hover:border-emerald-500'
                  }
                `}
              >
                {(preset as any).name}
              </button>
            );
          })}
          <button
            onClick={() => handlePresetSelect('normal')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </GlassCard>

      {/* TWO COLUMN INTERACTIVE CONTROLS & COMPARISONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Parametric Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard padding="md" className="space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" /> Parameter Adjustment Sliders
              </h3>
              <span className="text-[11px] text-emerald-600 font-mono font-bold">
                Live Simulator
              </span>
            </div>

            {/* Slider 1: Rainfall */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <span>Rainfall (mm)</span>
                  <Tooltip content="Average cumulative growing season precipitation." />
                </div>
                <span className="font-mono text-emerald-600 font-bold">{params.rainfall} mm</span>
              </div>
              <input
                type="range"
                min="300"
                max="2500"
                step="10"
                value={params.rainfall}
                onChange={(e) => handleSliderChange('rainfall', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-forest-950 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>300 mm (Deficit)</span>
                <span>1150 mm (Optimal)</span>
                <span>2500 mm (Surplus)</span>
              </div>
            </div>

            {/* Slider 2: Temperature */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <span>Mean Temperature (°C)</span>
                  <Tooltip content="Average daytime growing temperature." />
                </div>
                <span className="font-mono text-emerald-600 font-bold">{params.temperature}°C</span>
              </div>
              <input
                type="range"
                min="18.0"
                max="42.0"
                step="0.2"
                value={params.temperature}
                onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-forest-950 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>18°C</span>
                <span>28.5°C (Target)</span>
                <span>42°C (Heatwave)</span>
              </div>
            </div>

            {/* Slider 3: Soil Moisture */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <span>Soil Moisture (%)</span>
                  <Tooltip content="Effective volumetric root-zone water content." />
                </div>
                <span className="font-mono text-emerald-600 font-bold">{params.soil_moisture}%</span>
              </div>
              <input
                type="range"
                min="10.0"
                max="65.0"
                step="0.5"
                value={params.soil_moisture}
                onChange={(e) => handleSliderChange('soil_moisture', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-forest-950 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10% (Wilting)</span>
                <span>35% (Optimal)</span>
                <span>65% (Saturation)</span>
              </div>
            </div>

            {/* Slider 4: Nitrogen Level */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <span>Nitrogen Supply (kg/ha)</span>
                  <Tooltip content="Available nitrogen fertilizer application rate." />
                </div>
                <span className="font-mono text-emerald-600 font-bold">{params.nitrogen} kg/ha</span>
              </div>
              <input
                type="range"
                min="40"
                max="260"
                step="5"
                value={params.nitrogen}
                onChange={(e) => handleSliderChange('nitrogen', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-forest-950 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>40 kg/ha</span>
                <span>140 kg/ha</span>
                <span>260 kg/ha</span>
              </div>
            </div>

            {/* Slider 5: ONI Climate Index */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <span>Oceanic Niño Index (ONI)</span>
                  <Tooltip content="Pacific sea-surface temperature anomaly indicator (-2.5 to +2.5°C)." />
                </div>
                <span className={`font-mono font-bold ${params.oni_index >= 0.5 ? 'text-red-500' : params.oni_index <= -0.5 ? 'text-blue-500' : 'text-emerald-600'}`}>
                  {params.oni_index > 0 ? `+${params.oni_index}` : params.oni_index}°C
                </span>
              </div>
              <input
                type="range"
                min="-2.2"
                max="2.2"
                step="0.05"
                value={params.oni_index}
                onChange={(e) => handleSliderChange('oni_index', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-forest-950 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span className="text-blue-500">-2.0°C (La Niña)</span>
                <span>0.0°C (Neutral)</span>
                <span className="text-red-500">+2.0°C (El Niño)</span>
              </div>
            </div>

            {/* Slider 6: Historical Yield */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <span>Historical Baseline Yield (T/Ha)</span>
                  <Tooltip content="Past 3-year multi-harvest historical baseline." />
                </div>
                <span className="font-mono text-emerald-600 font-bold">{params.historical_yield} T/Ha</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="12.0"
                step="0.1"
                value={params.historical_yield}
                onChange={(e) => handleSliderChange('historical_yield', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-forest-950 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Scenario Comparison & Saved Scenarios (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Scenario Name & Description */}
          <GlassCard padding="md" className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white">
              Scenario Identification
            </h3>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="e.g. Drought Mitigation Scenario"
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-white dark:bg-forest-950 border border-slate-200 dark:border-forest-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-forest-900 dark:text-white"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Modify sliders to model severe El Niño heat waves or favorable La Niña rainfall surges.
            </p>
          </GlassCard>

          {/* Saved Scenarios Comparison Table */}
          <GlassCard padding="md" className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white">
                Saved Scenarios Comparison ({scenarios.length})
              </h3>
              <span className="text-[10px] text-slate-400">Baseline vs Scenarios</span>
            </div>

            {scenarios.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <p>No saved scenarios yet.</p>
                <p className="text-[11px]">Adjust sliders and click "Save Current Scenario" above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-forest-800 text-[10.5px] uppercase font-bold text-slate-400">
                      <th className="py-2">Scenario</th>
                      <th className="py-2">Yield</th>
                      <th className="py-2">Variance</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-forest-800/60 font-medium">
                    {/* Baseline row */}
                    <tr className="bg-slate-50/50 dark:bg-forest-950/40">
                      <td className="py-2.5 font-bold text-forest-900 dark:text-white">Baseline</td>
                      <td className="py-2.5 font-mono font-bold text-emerald-600">{currentPrediction.predicted_yield} T/Ha</td>
                      <td className="py-2.5 text-slate-400">0.0%</td>
                      <td className="py-2.5 text-right text-slate-400 text-[10px]">Reference</td>
                    </tr>
                    {scenarios.map(scen => (
                      <tr key={scen.id} className="hover:bg-emerald-50/50 dark:hover:bg-forest-800/50 transition-colors">
                        <td className="py-2.5 font-bold text-forest-900 dark:text-white truncate max-w-[120px]">
                          {scen.name}
                        </td>
                        <td className="py-2.5 font-mono font-bold text-emerald-600">
                          {scen.scenario_yield} T/Ha
                        </td>
                        <td className="py-2.5 font-mono font-bold">
                          <span className={scen.delta_yield >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                            {scen.delta_yield >= 0 ? `+${scen.delta_yield}` : scen.delta_yield}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => removeScenario(scen.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            aria-label="Remove scenario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
