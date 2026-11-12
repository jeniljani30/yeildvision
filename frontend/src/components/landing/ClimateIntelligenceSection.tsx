import React, { useEffect, useState } from 'react';
import {
  Thermometer,
  CloudRain,
  Compass,
  AlertCircle,
  Activity,
  Info,
  Calendar,
  Waves,
} from 'lucide-react';
import { apiService } from '../../services/api';
import { ClimateSummary, ONIRecord, ClimateAlert } from '../../types';

export const ClimateIntelligenceSection: React.FC = () => {
  const [summary, setSummary] = useState<ClimateSummary | null>(null);
  const [oniRecords, setOniRecords] = useState<ONIRecord[]>([]);
  const [alerts, setAlerts] = useState<ClimateAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadClimateData() {
      try {
        const [sum, oni, alt] = await Promise.all([
          apiService.getClimateSummary(-0.35),
          apiService.getONISeries(2018, 2026),
          apiService.getClimateAlerts(),
        ]);

        if (isMounted) {
          if (sum) setSummary(sum);
          if (oni) setOniRecords(oni.slice(-8));
          if (alt) setAlerts(alt);
        }
      } catch (e) {
        console.warn('Failed to load climate data:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadClimateData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="climate-intelligence"
      className="py-24 sm:py-36 px-6 sm:px-8 bg-[#F2FAF5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
              MACROENVIRONMENTAL SURVEILLANCE
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#073B2A] tracking-[-1px] font-normal leading-[1.05]">
            Climate Intelligence.
          </h2>
          <p className="mt-4 text-[#4F5A54] text-base sm:text-lg font-sans max-w-2xl mx-auto">
            Monitoring El Niño Southern Oscillation (ENSO), thermal departures, and rainfall anomalies
            shaping broader regional harvest dynamics across India.
          </p>

          {/* Explicit Separation Disclaimer */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-slate-200/60 text-xs font-sans text-[#4F5A54] shadow-sm">
            <Info className="w-4 h-4 text-[#073B2A] shrink-0" />
            <span>
              <strong>Note:</strong> Climate Context provides regional ambient surveillance; the trial model
              operates directly on field micro-meteorology.
            </span>
          </div>
        </div>

        {/* 4 Macro Surveillance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* ONI Indicator */}
          <div className="p-6 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-sm text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-sans font-semibold tracking-wider text-[#6F6F6F]">
                OCEANIC NIÑO INDEX (ONI)
              </span>
              <Waves className="w-4 h-4 text-[#073B2A]" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#073B2A]">
              {summary ? (summary.oni_value > 0 ? `+${summary.oni_value}` : summary.oni_value) : '-0.35'}
            </div>
            <div className="mt-1 text-xs text-[#073B2A] font-semibold font-sans">
              Phase: {summary?.climate_state || 'Neutral'}
            </div>
            <p className="text-[11px] text-[#6F6F6F] mt-2 font-sans leading-tight">
              {summary?.sea_surface_temp_anomaly || '-0.35°C in Niño 3.4 index area'}
            </p>
          </div>

          {/* Rainfall Anomaly */}
          <div className="p-6 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-sm text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-sans font-semibold tracking-wider text-[#6F6F6F]">
                RAINFALL ANOMALY
              </span>
              <CloudRain className="w-4 h-4 text-[#073B2A]" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#073B2A]">
              {summary?.rainfall_anomaly || '+1.8%'}
            </div>
            <div className="mt-1 text-xs text-emerald-700 font-semibold font-sans">
              Within Normal Distribution
            </div>
            <p className="text-[11px] text-[#6F6F6F] mt-2 font-sans leading-tight">
              Precipitation alignment versus historical 30-year IMD monsoon baseline.
            </p>
          </div>

          {/* Temperature Anomaly */}
          <div className="p-6 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-sm text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-sans font-semibold tracking-wider text-[#6F6F6F]">
                THERMAL DEPARTURE
              </span>
              <Thermometer className="w-4 h-4 text-[#073B2A]" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#073B2A]">
              {summary?.temperature_anomaly || '+0.2°C'}
            </div>
            <div className="mt-1 text-xs text-amber-700 font-semibold font-sans">
              Mild Positive Trend
            </div>
            <p className="text-[11px] text-[#6F6F6F] mt-2 font-sans leading-tight">
              Sub-seasonal thermal variance within safe cane photosynthesis thresholds.
            </p>
          </div>

          {/* Active Cycle */}
          <div className="p-6 rounded-2xl bg-[#073B2A] text-white shadow-md text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-sans font-semibold tracking-wider text-emerald-300">
                ACTIVE ENSO CYCLE
              </span>
              <Activity className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="font-serif text-2xl text-white">
              {summary?.active_enso_cycle || 'Cycle 2025/26'}
            </div>
            <div className="mt-2 text-xs text-emerald-100 font-sans font-medium">
              Yield Sensitivity: {summary?.yield_sensitivity || 'Baseline (±1.5%)'}
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-2 font-sans leading-tight">
              Atmospheric stability favors normal commercial sucrose translocation.
            </p>
          </div>
        </div>

        {/* ONI Historical Trajectory & Regional Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: ONI Trend Visualizer */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-[24px] bg-white/80 backdrop-blur-md border border-white text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-2xl text-[#073B2A]">
                  Longitudinal ONI Pacific Teleconnections
                </h3>
                <p className="text-xs text-[#6F6F6F] font-sans mt-0.5">
                  El Niño (ONI &gt; +0.5) vs La Niña (ONI &lt; -0.5) historical phases
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {oniRecords.map((rec, i) => {
                const isElNino = rec.phase === 'El Niño';
                const isLaNina = rec.phase === 'La Niña';

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FAFCF9] border border-slate-100 text-xs font-sans"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-[#17201C] w-12">{rec.year}</span>
                      <span className="text-[#6F6F6F] w-20">{rec.season}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isElNino
                            ? 'bg-rose-100 text-rose-800'
                            : isLaNina
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {rec.phase}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[#6F6F6F] text-[11px]">
                        Yield Benchmark: <strong>{rec.sugarcane_yield} T/Ha</strong>
                      </span>
                      <span
                        className={`font-serif text-sm font-semibold ${
                          rec.oni_value > 0 ? 'text-amber-700' : 'text-blue-700'
                        }`}
                      >
                        {rec.oni_value > 0 ? `+${rec.oni_value}` : rec.oni_value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Regional Agricultural Advisories */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-[24px] bg-white/80 backdrop-blur-md border border-white text-left">
            <h3 className="font-serif text-2xl text-[#073B2A] mb-4">
              Regional Agro-Advisories
            </h3>

            <div className="space-y-4">
              {alerts.slice(0, 3).map((al) => (
                <div
                  key={al.id}
                  className="p-4 rounded-xl bg-[#FAFCF9] border border-[#073B2A]/10 text-left"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-serif font-semibold text-[#073B2A]">
                      {al.title}
                    </span>
                    <span className="text-[10px] uppercase font-sans font-semibold px-2 py-0.5 rounded-full bg-[#DDF5EA] text-[#073B2A]">
                      {al.severity}
                    </span>
                  </div>
                  <p className="text-xs text-[#4F5A54] font-sans leading-relaxed mb-2">
                    {al.description}
                  </p>
                  <div className="text-[11px] text-[#073B2A] font-sans font-medium flex items-center gap-1.5 pt-2 border-t border-slate-100">
                    <strong>Mitigation:</strong> {al.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
