import React from 'react';
import { PredictionRecord } from '../../types';
import { CircularProgress } from '../ui/CircularProgress';
import { MetricPill } from '../ui/MetricPill';
import { Tooltip } from '../ui/Tooltip';
import { CheckCircle2, Layers } from 'lucide-react';

interface PredictionResultCardProps {
  prediction: PredictionRecord;
  unit?: string;
}

const formatModelName = (name: string): string => {
  if (name.toLowerCase().includes('voting')) return 'Voting Regressor';
  if (name.toLowerCase().includes('support') || name.toLowerCase().includes('svr')) return 'Support Vector (SVR)';
  if (name.toLowerCase().includes('decision')) return 'Decision Tree';
  if (name.toLowerCase().includes('random')) return 'Random Forest';
  if (name.toLowerCase().includes('linear')) return 'Linear Regression';
  return name;
};

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  prediction,
  unit
}) => {
  const displayUnit = unit || prediction.unit || 'Quintal/Acre';
  const models = prediction.model_outputs || {};

  return (
    <div className="space-y-6">
      {/* Primary Result Glass Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-forest-900/80 border border-emerald-500/25 shadow-glass relative overflow-hidden">
        {/* Subtle accent backdrop blur circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-emerald-500/10">
          {/* Left: Headline & Metrics */}
          <div className="space-y-2 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <MetricPill label="Voting Regressor" variant="forest" />
              <MetricPill label="Ensemble Active" variant="emerald" icon={<CheckCircle2 className="w-3.5 h-3.5" />} />
              <MetricPill 
                label={`${prediction.climate_state} Phase`} 
                variant={prediction.climate_state === 'El Niño' ? 'amber' : prediction.climate_state === 'La Niña' ? 'blue' : 'gray'} 
              />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mt-2">
                Predicted Crop Yield ({prediction.crop})
              </p>
              <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-1">
                <span className="text-5xl sm:text-6xl font-serif font-normal text-[#064E3B] dark:text-emerald-400 tracking-tight">
                  {prediction.predicted_yield}
                </span>
                <span className="text-xl sm:text-2xl font-sans font-medium text-[#527365] dark:text-emerald-300">
                  {displayUnit}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Calibrated across {prediction.location} ({prediction.district || 'All Districts'}) • {prediction.season}
            </p>
          </div>

          {/* Right: Circular Progress Confidence Gauge */}
          <div className="flex flex-col items-center shrink-0 pr-1">
            <CircularProgress
              value={prediction.confidence}
              size={120}
              strokeWidth={9}
              label={`${prediction.confidence}%`}
              sublabel="Confidence"
              color="#10b981"
            />
          </div>
        </div>

        {/* Individual Estimators Benchmarking Matrix */}
        <div className="pt-5 space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-forest-900 dark:text-slate-100 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-500" /> Individual Estimator Outputs
            </h4>
            <Tooltip content="Output predictions, Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and R² coefficient of determination for each candidate model." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(models).map(([modelName, metrics]) => {
              const isVoting = modelName.toLowerCase().includes('voting');

              return (
                <div
                  key={modelName}
                  className={`
                    p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between
                    ${isVoting
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20'
                      : 'bg-slate-50/80 dark:bg-forest-950/40 border-slate-200/80 dark:border-forest-800'
                    }
                  `}
                >
                  {/* Top Row: Model Name, Selected Tag, and R² */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className={`font-bold text-sm truncate ${isVoting ? 'text-forest-900 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}
                        title={modelName}
                      >
                        {formatModelName(modelName)}
                      </span>
                      {isVoting && (
                        <span className="shrink-0 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white leading-none">
                          Selected
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      R² {metrics.r2.toFixed(3)}
                    </span>
                  </div>

                  {/* Middle Row: Yield Value and Unit (clean, uncrowded) */}
                  <div className="flex items-baseline gap-2 mb-2.5">
                    <span className="text-2xl sm:text-[26px] font-black text-forest-900 dark:text-white tracking-tight">
                      {metrics.prediction}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {displayUnit}
                    </span>
                  </div>

                  {/* Bottom Row: MAE and RMSE */}
                  <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-200/70 dark:border-forest-800/80 text-xs font-medium text-slate-600 dark:text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>MAE:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{metrics.mae.toFixed(3)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>RMSE:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{metrics.rmse.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
