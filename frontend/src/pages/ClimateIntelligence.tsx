import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/ui/GlassCard';
import { MetricPill } from '../components/ui/MetricPill';
import { Tooltip } from '../components/ui/Tooltip';
import { ONIMatrixChart } from '../components/charts/ONIMatrixChart';
import { apiService } from '../services/api';
import { ClimateSummary, ONIRecord, ClimateAlert } from '../types';
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  Compass, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Layers,
  Filter,
  Activity
} from 'lucide-react';

export const ClimateIntelligence: React.FC = () => {
  const { crop, currentPrediction } = useApp();
  const [climateSummary, setClimateSummary] = useState<ClimateSummary | null>(null);
  const [oniRecords, setOniRecords] = useState<ONIRecord[]>([]);
  const [alerts, setAlerts] = useState<ClimateAlert[]>([]);
  const [phaseFilter, setPhaseFilter] = useState<string>('All');
  const [timeRange, setTimeRange] = useState<string>('2015-2026');
  const [selectedCrop, setSelectedCrop] = useState<string>(crop);

  useEffect(() => {
    let isMounted = true;
    apiService.getClimateSummary(currentPrediction.inputs.oni_index).then(res => {
      if (isMounted) setClimateSummary(res);
    });
    apiService.getONISeries(2015, 2026, phaseFilter).then(res => {
      if (isMounted) setOniRecords(res);
    });
    apiService.getClimateAlerts().then(res => {
      if (isMounted) setAlerts(res);
    });
    return () => { isMounted = false; };
  }, [currentPrediction.inputs.oni_index, phaseFilter]);

  const summary = climateSummary || {
    oni_value: currentPrediction.inputs.oni_index,
    climate_state: currentPrediction.climate_state,
    climate_variability: 'Moderate (0.32)',
    yield_sensitivity: 'Baseline (±1.5%)',
    rainfall_anomaly: '+1.8% vs Normal',
    temperature_anomaly: '+0.2°C vs Normal',
    sea_surface_temp_anomaly: `${currentPrediction.inputs.oni_index}°C in Niño 3.4`,
    active_enso_cycle: 'Cycle 2025/2026 Neutral'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.24em] text-[#064E3B] dark:text-emerald-400 mb-1.5">
            <span>• CLIMATE ANOMALY TRACKING</span>
            <span>•</span>
            <span>ENSO / ONI TELECONNECTIONS •</span>
          </div>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl lg:text-[42px] text-[#064E3B] dark:text-white tracking-tight leading-tight">
            Climate Intelligence & Anomaly Tracking
          </h1>
          <p className="text-sm sm:text-base text-[#65756E] dark:text-slate-300 mt-1.5 font-sans">
            Monitor ENSO/ONI climate indicators and their relationship with agricultural yield.
          </p>
        </div>

        <MetricPill
          label={`Active Cycle: ${summary.climate_state}`}
          variant={summary.climate_state === 'El Niño' ? 'red' : summary.climate_state === 'La Niña' ? 'blue' : 'emerald'}
          size="md"
        />
      </div>

      {/* CLIMATE SUMMARY CARDS (6 Indicators) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. ONI Value */}
        <GlassCard padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10.5px] font-bold uppercase">ONI Index</span>
            <Activity className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="text-xl font-extrabold text-forest-900 dark:text-white">
            {summary.oni_value > 0 ? `+${summary.oni_value}` : summary.oni_value}°C
          </div>
          <p className="text-[10px] text-slate-400">Niño 3.4 Region</p>
        </GlassCard>

        {/* 2. Climate State */}
        <GlassCard padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10.5px] font-bold uppercase">Climate State</span>
            <CloudSun className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-forest-900 dark:text-white">
            {summary.climate_state}
          </div>
          <p className="text-[10px] text-slate-400">Neutral Coupling</p>
        </GlassCard>

        {/* 3. Temp Anomaly */}
        <GlassCard padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10.5px] font-bold uppercase">Thermal Anomaly</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
            {summary.temperature_anomaly}
          </div>
          <p className="text-[10px] text-slate-400">Above baseline</p>
        </GlassCard>

        {/* 4. Rainfall Anomaly */}
        <GlassCard padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10.5px] font-bold uppercase">Rain Anomaly</span>
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
            {summary.rainfall_anomaly}
          </div>
          <p className="text-[10px] text-slate-400">30-Year Normal</p>
        </GlassCard>

        {/* 5. Climate Variability */}
        <GlassCard padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10.5px] font-bold uppercase">Variability</span>
            <Wind className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-base font-extrabold text-forest-900 dark:text-white truncate">
            {summary.climate_variability}
          </div>
          <p className="text-[10px] text-slate-400">Atmospheric stability</p>
        </GlassCard>

        {/* 6. Yield Sensitivity */}
        <GlassCard padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10.5px] font-bold uppercase">Yield Sensitivity</span>
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-sm font-extrabold text-forest-900 dark:text-white truncate">
            {summary.yield_sensitivity}
          </div>
          <p className="text-[10px] text-slate-400">Estimated shift</p>
        </GlassCard>
      </div>

      {/* LARGE ONI MULTI-DECADAL MATRIX & TREND CHART */}
      <GlassCard padding="md" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/10 pb-3">
          <div>
            <h2 className="text-sm font-bold text-forest-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Oceanic Niño Index (ONI) Multi-Decadal Matrix & Trend (1995–2026)
            </h2>
            <p className="text-xs text-slate-400">
              3-Month Running Mean of ERSST.v5 SST Anomalies in Niño 3.4 Region vs Historical Yields
            </p>
          </div>

          {/* Interactive Chart Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Phases</option>
              <option value="El Niño">El Niño Only</option>
              <option value="Neutral">Neutral Only</option>
              <option value="La Niña">La Niña Only</option>
            </select>

            <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-forest-900 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              Sugarcane Yields
            </span>
          </div>
        </div>

        <ONIMatrixChart data={oniRecords} crop={selectedCrop} />
      </GlassCard>

      {/* TWO COLUMN ROW: Climate Heatmap & Model Vulnerability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Thermal & Precipitation Heatmap (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard padding="md" className="space-y-4">
            <div className="border-b border-emerald-500/10 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white">
                Precipitation & Thermal Anomaly Heatmap (2022–2026)
              </h3>
              <p className="text-[11px] text-slate-400">
                Monthly divergence matrix showing risk tiers across agro-climatic zones
              </p>
            </div>

            {/* Heatmap Grid */}
            <div className="space-y-2">
              {[2023, 2024, 2025, 2026].map(yr => (
                <div key={yr} className="flex items-center gap-2 text-xs">
                  <span className="w-10 font-bold font-mono text-slate-700 dark:text-slate-300">{yr}</span>
                  <div className="flex-1 grid grid-cols-12 gap-1">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, idx) => {
                      const isHighAnom = yr === 2023 && idx >= 5 && idx <= 9; // 2023 El Nino
                      const isLaNina = yr === 2022;
                      const bg = isHighAnom ? 'bg-red-400 dark:bg-red-600' : isLaNina ? 'bg-blue-400 dark:bg-blue-600' : 'bg-emerald-300 dark:bg-emerald-700';

                      return (
                        <div
                          key={idx}
                          title={`${yr} Month ${idx + 1}: ${isHighAnom ? 'Severe El Niño Deficit' : 'Favorable Range'}`}
                          className={`h-6 rounded cursor-help flex items-center justify-center text-[9px] font-bold text-white transition-transform hover:scale-110 ${bg}`}
                        >
                          {m}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-forest-800">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Normal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" /> La Niña Surplus</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500" /> El Niño Deficit</span>
            </div>
          </GlassCard>

          {/* Model Climate Vulnerability */}
          <GlassCard padding="md" className="space-y-3">
            <div className="border-b border-emerald-500/10 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" /> Model Vulnerability Under Climate Shock
              </h3>
              <p className="text-[11px] text-slate-400">
                Evaluation of ML estimator stability when ONI oscillates beyond ±1.5°C
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20">
                <div className="flex justify-between font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                  <span>Voting Regressor</span>
                  <span>96.2% Resilience (Recommended)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Ensemble averaging dampens single-estimator overreaction to severe drought or unseasonal monsoon deluge.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800">
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-200 mb-1">
                  <span>Random Forest</span>
                  <span>91.8% Resilience</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Captures non-linear wilting thresholds cleanly, but can slightly overfit localized rainfall anomalies.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800">
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-200 mb-1">
                  <span>Support Vector Regression (SVR)</span>
                  <span>88.5% Resilience</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Smooth RBF kernel requires regularized epsilon margin tuning to handle abrupt step-change monsoon disruptions.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Climate Alerts & Actionable Mitigations (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  Dynamic Climate Alert System
                </h3>
                <p className="text-[11px] text-slate-400">
                  Automated advisories and farmer mitigation pathways
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                4 Active Feeds
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`
                    p-3.5 rounded-2xl border text-xs space-y-2 transition-all
                    ${alert.color === 'amber' ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500/30' :
                      alert.color === 'red' ? 'bg-red-50/70 dark:bg-red-950/30 border-red-500/30' :
                      'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/30'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${alert.color === 'amber' ? 'bg-amber-500' : alert.color === 'red' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      <span className="font-bold text-forest-900 dark:text-white">{alert.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    {alert.description}
                  </p>

                  <div className="p-2 rounded-xl bg-white/80 dark:bg-forest-900/80 border border-slate-200/50 dark:border-forest-800 text-[10.5px]">
                    <strong className="text-forest-900 dark:text-emerald-400">Mitigation: </strong>
                    <span className="text-slate-600 dark:text-slate-300">{alert.mitigation}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
