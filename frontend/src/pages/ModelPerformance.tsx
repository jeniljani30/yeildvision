import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/ui/GlassCard';
import { MetricPill } from '../components/ui/MetricPill';
import { Tooltip } from '../components/ui/Tooltip';
import { ActualVsPredictedChart } from '../components/charts/ActualVsPredictedChart';
import { 
  BarChart3, 
  Layers, 
  CheckCircle, 
  Cpu, 
  GitFork, 
  Filter, 
  TrendingUp, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ModelPerformance: React.FC = () => {
  const { crop, season, currentPrediction } = useApp();
  const [filterCrop, setFilterCrop] = useState<string>(crop);
  const [filterDataset, setFilterDataset] = useState<string>('Standard 80/20 Test Partition');

  const isTrialDataset = filterDataset === 'DATA-004';

  const benchmarkMatrix = isTrialDataset ? [
    {
      model: 'Support Vector Regression (SVR)',
      mae: 1.582,
      mse: 3.913,
      rmse: 1.978,
      r2: 0.9997,
      prediction: 484.30,
      rank: 1,
      status: 'Best Single Estimator (45% wt)',
      weight: '45%'
    },
    {
      model: 'Decision Tree',
      mae: 1.867,
      mse: 6.124,
      rmse: 2.475,
      r2: 0.9995,
      prediction: 485.30,
      rank: 2,
      status: 'Sub-Estimator (25% wt)',
      weight: '25%'
    },
    {
      model: 'Voting Regressor',
      mae: 2.122,
      mse: 7.771,
      rmse: 2.788,
      r2: 0.9993,
      prediction: 484.29,
      rank: 3,
      status: 'Primary Meta-Estimator',
      weight: '45% SVR + 25% DT + 20% RF + 10% LR'
    },
    {
      model: 'Random Forest',
      mae: 3.196,
      mse: 18.172,
      rmse: 4.263,
      r2: 0.9984,
      prediction: 484.38,
      rank: 4,
      status: 'Sub-Estimator (20% wt)',
      weight: '20%'
    },
    {
      model: 'Linear Regression',
      mae: 11.313,
      mse: 282.836,
      rmse: 16.818,
      r2: 0.9754,
      prediction: 481.53,
      rank: 5,
      status: 'Baseline Anchor (10% wt)',
      weight: '10%'
    }
  ] : [
    {
      model: 'Voting Regressor',
      mae: 0.280,
      mse: 0.152,
      rmse: 0.390,
      r2: 0.942,
      prediction: 7.82,
      rank: 1,
      status: 'Primary Meta-Estimator',
      weight: '40% RF + 25% SVR + 20% DT + 15% LR'
    },
    {
      model: 'Random Forest',
      mae: 0.312,
      mse: 0.176,
      rmse: 0.420,
      r2: 0.931,
      prediction: 7.91,
      rank: 2,
      status: 'Sub-Estimator (40% wt)',
      weight: '40%'
    },
    {
      model: 'Support Vector Regression (SVR)',
      mae: 0.354,
      mse: 0.211,
      rmse: 0.460,
      r2: 0.918,
      prediction: 7.78,
      rank: 3,
      status: 'Sub-Estimator (25% wt)',
      weight: '25%'
    },
    {
      model: 'Decision Tree',
      mae: 0.442,
      mse: 0.336,
      rmse: 0.580,
      r2: 0.884,
      prediction: 7.69,
      rank: 4,
      status: 'Sub-Estimator (20% wt)',
      weight: '20%'
    },
    {
      model: 'Linear Regression',
      mae: 0.490,
      mse: 0.384,
      rmse: 0.620,
      r2: 0.865,
      prediction: 7.74,
      rank: 5,
      status: 'Baseline Anchor (15% wt)',
      weight: '15%'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#064E3B] dark:text-emerald-400 mb-1">
            <span>• MODEL BENCHMARKING</span>
            <span>•</span>
            <span>5-ESTIMATOR ENSEMBLE METRICS •</span>
          </div>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl text-[#064E3B] dark:text-white tracking-tight leading-tight">
            Model Performance & Benchmarking
          </h1>
          <p className="text-xs sm:text-sm text-[#65756E] dark:text-slate-400 mt-1 font-sans">
            Evaluate candidate estimators, residual error distributions, and ensemble weight calibrations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterDataset}
            onChange={(e) => setFilterDataset(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-forest-900 border border-slate-200 dark:border-forest-800 text-forest-900 dark:text-white focus:outline-none"
          >
            <option value="DATA-004">Sugarcane Field Trials Dataset (120 Trials)</option>
            <option value="Standard 80/20 Test Partition">Standard Baseline Partition</option>
          </select>

          <span className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-50 dark:bg-forest-900 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
            Sugarcane Estimator
          </span>
        </div>
      </div>

      {/* ENSEMBLE EXPLANATION ARCHITECTURE CARD */}
      <GlassCard padding="md" className="space-y-4 border-emerald-500/30">
        <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
          <div>
            <h2 className="text-sm font-bold text-forest-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              {isTrialDataset ? 'Cultivar-Calibrated Ensemble Architecture' : 'Voting Regressor Ensemble Architecture'}
            </h2>
            <p className="text-xs text-slate-400">
              {isTrialDataset 
                ? 'Empirically weighted soft voting regressor optimized on 120 ICAR multi-varietal field trials'
                : 'Multi-model soft weighted averaging pipeline dampening individual estimator biases'}
            </p>
          </div>
          <MetricPill label={isTrialDataset ? "Ensemble R²: 0.9993" : "Optimal Calibration"} variant="emerald" />
        </div>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
          {/* 4 Base Models */}
          <div className="md:col-span-3 grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-forest-950/60 border border-slate-200 dark:border-forest-800">
              <span className="text-[10px] font-bold uppercase text-blue-600">{isTrialDataset ? 'Weight: 45%' : 'Weight: 25%'}</span>
              <p className="text-xs font-bold text-forest-900 dark:text-white mt-0.5">Support Vector (SVR)</p>
              <p className="text-[10px] text-slate-400">{isTrialDataset ? 'R² = 0.9997 (Best Single)' : 'RBF Kernel (C=8.0)'}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-forest-950/60 border border-slate-200 dark:border-forest-800">
              <span className="text-[10px] font-bold uppercase text-purple-600">{isTrialDataset ? 'Weight: 25%' : 'Weight: 20%'}</span>
              <p className="text-xs font-bold text-forest-900 dark:text-white mt-0.5">Decision Tree</p>
              <p className="text-[10px] text-slate-400">{isTrialDataset ? 'R² = 0.9995 (Non-linear)' : 'Depth Regulated (d=7)'}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-forest-950/60 border border-slate-200 dark:border-forest-800">
              <span className="text-[10px] font-bold uppercase text-emerald-600">{isTrialDataset ? 'Weight: 20%' : 'Weight: 40%'}</span>
              <p className="text-xs font-bold text-forest-900 dark:text-white mt-0.5">Random Forest</p>
              <p className="text-[10px] text-slate-400">{isTrialDataset ? '100 Bagged Trees' : '120 Bagged Trees'}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-forest-950/60 border border-slate-200 dark:border-forest-800">
              <span className="text-[10px] font-bold uppercase text-amber-600">{isTrialDataset ? 'Weight: 10%' : 'Weight: 15%'}</span>
              <p className="text-xs font-bold text-forest-900 dark:text-white mt-0.5">Linear Regression</p>
              <p className="text-[10px] text-slate-400">OLS Baseline</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center justify-center text-emerald-600">
            <ArrowRight className="w-6 h-6 animate-pulse" />
            <span className="text-[10px] font-bold mt-1 uppercase">Weighted Vote</span>
          </div>

          {/* Final Ensemble Box */}
          <div className="p-4 rounded-2xl bg-forest-900 dark:bg-emerald-600 text-white shadow-lg space-y-1">
            <Sparkles className="w-5 h-5 mx-auto text-emerald-300 dark:text-forest-950" />
            <p className="text-xs font-extrabold tracking-tight">Voting Regressor</p>
            <p className="text-lg font-black">{isTrialDataset ? '484.29 Q/Acre' : (filterCrop === 'Sugarcane' ? '7.82' : '2.94') + ' T/Ha'}</p>
            <p className="text-[10px] text-emerald-200 dark:text-forest-950 font-semibold">
              {isTrialDataset ? 'R² = 0.9993 • RMSE: 2.79 Q/A' : 'R² = 0.942 • Lowest RMSE'}
            </p>
          </div>
        </div>
      </GlassCard>


      {/* CANDIDATE ESTIMATOR BENCHMARKING MATRIX TABLE */}
      <GlassCard padding="md" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-forest-900 dark:text-white">
              Candidate Estimator Benchmarking Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Statistical validation across test partition (MAE, MSE, RMSE, R² Score)
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {isTrialDataset ? 'N = 120 Multi-Varietal Field Trials' : 'N = 2,000 Verified Observations'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-forest-800 text-[10.5px] uppercase font-bold text-slate-400">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Model Estimator</th>
                <th className="py-2.5 px-3">MAE <Tooltip content="Mean Absolute Error: average magnitude of prediction errors." /></th>
                <th className="py-2.5 px-3">MSE <Tooltip content="Mean Squared Error: penalizes larger outlier deviations." /></th>
                <th className="py-2.5 px-3">RMSE <Tooltip content={`Root Mean Squared Error: standard deviation of residuals in ${isTrialDataset ? 'Q/Acre' : 'T/Ha'}.`} /></th>
                <th className="py-2.5 px-3">R² Score <Tooltip content="Coefficient of Determination: proportion of yield variance explained by the model." /></th>
                <th className="py-2.5 px-3">Test Prediction</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-forest-800/60 font-medium">
              {benchmarkMatrix.map(m => {
                const isFirst = m.rank === 1;

                return (
                  <tr
                    key={m.model}
                    className={`
                      transition-colors
                      ${isFirst ? 'bg-emerald-50/80 dark:bg-emerald-950/40 font-bold' : 'hover:bg-slate-50 dark:hover:bg-forest-950/50'}
                    `}
                  >
                    <td className="py-3 px-3">
                      <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${isFirst ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-forest-800 text-slate-600'}`}>
                        {m.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-forest-900 dark:text-white">{m.model}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{m.weight}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700 dark:text-slate-200">
                      {m.mae.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700 dark:text-slate-200">
                      {m.mse.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700 dark:text-slate-200">
                      {m.rmse.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {m.r2.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-forest-900 dark:text-white">
                      {m.prediction} {isTrialDataset ? 'Q/Acre' : 'T/Ha'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${isFirst ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-forest-800 text-slate-600'}`}>
                        {isFirst ? 'Recommended' : 'Evaluated'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* METRICS VISUAL COMPARISON CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* R² Score Comparison Bar Chart */}
        <GlassCard padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white">
              R² Coefficient of Determination Comparison
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold">Higher is Better</span>
          </div>

          <div className="space-y-3">
            {benchmarkMatrix.map(m => (
              <div key={m.model} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{m.model}</span>
                  <span className="font-mono font-bold text-emerald-600">{m.r2.toFixed(3)}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-forest-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${m.rank === 1 ? 'bg-emerald-600' : 'bg-slate-400 dark:bg-forest-700'}`}
                    style={{ width: `${(m.r2 / 1.0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* RMSE Error Comparison Bar Chart */}
        <GlassCard padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white">
              Root Mean Squared Error (RMSE) Comparison
            </h3>
            <span className="text-[11px] text-blue-600 font-bold">Lower is Better</span>
          </div>

          <div className="space-y-3">
            {benchmarkMatrix.map(m => {
              const maxRmse = Math.max(...benchmarkMatrix.map(item => item.rmse), 1.0);
              return (
                <div key={m.model} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{m.model}</span>
                    <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                      {m.rmse.toFixed(3)} {isTrialDataset ? 'Q/A' : 'T/Ha'}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-forest-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${m.rank === 1 ? 'bg-emerald-500' : 'bg-blue-400 dark:bg-blue-700'}`}
                      style={{ width: `${Math.min(100, (m.rmse / maxRmse) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
