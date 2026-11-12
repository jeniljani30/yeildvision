import React, { useEffect, useState } from 'react';
import { Brain, Layers, Cpu, Award, CheckCircle2, BarChart2 } from 'lucide-react';
import { apiService } from '../../services/api';

interface ModelBenchmark {
  model: string;
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
  prediction: number;
  rank: number;
  status: string;
  weight: string;
}

export const MachineLearningSection: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<ModelBenchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>('Voting Regressor');

  useEffect(() => {
    let isMounted = true;
    async function fetchModelData() {
      try {
        const data = await apiService.getModelPerformance('Sugarcane');
        if (data && data.benchmarks && isMounted) {
          setBenchmarks(data.benchmarks);
        }
      } catch (e) {
        console.warn('Failed to load live model benchmarks:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchModelData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Standard fallback using exact real backend figures if network issue
  const displayModels: ModelBenchmark[] = benchmarks.length > 0 ? benchmarks : [
    {
      model: 'Voting Regressor',
      mae: 2.122,
      mse: 7.771,
      rmse: 2.788,
      r2: 0.9993,
      prediction: 484.29,
      rank: 1,
      status: 'Selected Meta-Estimator',
      weight: '45% SVR + 25% DT + 20% RF + 10% LR',
    },
    {
      model: 'Support Vector Regression (SVR)',
      mae: 1.582,
      mse: 3.913,
      rmse: 1.978,
      r2: 0.9997,
      prediction: 484.30,
      rank: 2,
      status: 'Best Single Estimator (45% wt)',
      weight: '45% (Voting)',
    },
    {
      model: 'Decision Tree',
      mae: 1.867,
      mse: 6.124,
      rmse: 2.475,
      r2: 0.9995,
      prediction: 485.30,
      rank: 3,
      status: 'Sub-Estimator (25% wt)',
      weight: '25% (Voting)',
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
      weight: '20% (Voting)',
    },
    {
      model: 'Linear Regression',
      mae: 11.313,
      mse: 282.836,
      rmse: 16.818,
      r2: 0.9754,
      prediction: 481.53,
      rank: 5,
      status: 'Baseline Linear Anchor (10% wt)',
      weight: '10% (Voting)',
    },
  ];

  return (
    <section
      id="models"
      className="py-24 sm:py-36 px-6 sm:px-8 bg-[#FAFCF9] relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
              MULTI-MODEL INTELLIGENCE
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#073B2A] tracking-[-1px] font-normal leading-[1.05]">
            Five models.{' '}
            <span className="text-[#6F6F6F] block mt-1">
              One intelligent prediction.
            </span>
          </h2>
          <p className="mt-4 text-[#4F5A54] text-base sm:text-lg font-sans max-w-2xl mx-auto">
            Rather than relying on a solitary regressor, YieldVision fuses non-linear kernel support,
            decision splits, and ensemble bagging to deliver exceptional accuracy.
          </p>
        </div>

        {/* 5 Model Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayModels.map((item) => {
            const isVoting = item.model.includes('Voting');
            const isSelected = selectedModel === item.model;

            return (
              <div
                key={item.model}
                onClick={() => setSelectedModel(item.model)}
                className={`group cursor-pointer p-7 rounded-[24px] transition-all duration-300 ${
                  isVoting
                    ? 'md:col-span-2 lg:col-span-1 bg-[#073B2A] text-white shadow-xl hover:-translate-y-1.5 border border-[#0B4D38]'
                    : isSelected
                    ? 'bg-white shadow-[0_16px_40px_rgba(7,59,42,0.12)] -translate-y-1.5 border-2 border-[#073B2A]'
                    : 'bg-white/80 hover:bg-white backdrop-blur-md border border-white/80 shadow-[0_10px_30px_rgba(7,59,42,0.05)] hover:shadow-[0_16px_40px_rgba(7,59,42,0.10)] hover:-translate-y-1.5'
                }`}
              >
                {/* Header: Title & Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3
                      className={`font-serif text-2xl ${
                        isVoting ? 'text-white' : 'text-[#073B2A]'
                      }`}
                    >
                      {item.model}
                    </h3>
                    <div
                      className={`text-[11px] font-sans font-medium uppercase tracking-wider mt-1 ${
                        isVoting ? 'text-emerald-300' : 'text-[#6F6F6F]'
                      }`}
                    >
                      {item.status}
                    </div>
                  </div>
                  {isVoting && (
                    <span className="p-2 rounded-full bg-emerald-500/20 text-emerald-300">
                      <Award className="w-5 h-5" />
                    </span>
                  )}
                </div>

                {/* Metrics Grid */}
                <div
                  className={`grid grid-cols-3 gap-2 p-3.5 rounded-xl my-5 ${
                    isVoting ? 'bg-white/10' : 'bg-[#F2FAF5]'
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-[10px] font-sans uppercase tracking-wider ${
                        isVoting ? 'text-slate-300' : 'text-[#6F6F6F]'
                      }`}
                    >
                      MAE
                    </div>
                    <div
                      className={`font-serif text-lg font-normal ${
                        isVoting ? 'text-white' : 'text-[#17201C]'
                      }`}
                    >
                      {item.mae.toFixed(2)}
                    </div>
                  </div>

                  <div className="text-center border-x border-current/10">
                    <div
                      className={`text-[10px] font-sans uppercase tracking-wider ${
                        isVoting ? 'text-slate-300' : 'text-[#6F6F6F]'
                      }`}
                    >
                      RMSE
                    </div>
                    <div
                      className={`font-serif text-lg font-normal ${
                        isVoting ? 'text-white' : 'text-[#17201C]'
                      }`}
                    >
                      {item.rmse.toFixed(2)}
                    </div>
                  </div>

                  <div className="text-center">
                    <div
                      className={`text-[10px] font-sans uppercase tracking-wider ${
                        isVoting ? 'text-slate-300' : 'text-[#6F6F6F]'
                      }`}
                    >
                      R² SCORE
                    </div>
                    <div
                      className={`font-serif text-lg font-normal ${
                        isVoting ? 'text-emerald-300 font-semibold' : 'text-[#073B2A] font-semibold'
                      }`}
                    >
                      {item.r2.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Weight / Ensemble contribution */}
                <div className="mt-4 pt-3 border-t border-current/10">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span
                      className={`font-sans font-medium ${
                        isVoting ? 'text-slate-300' : 'text-[#4F5A54]'
                      }`}
                    >
                      Weight Contribution
                    </span>
                    <span
                      className={`font-sans font-semibold ${
                        isVoting ? 'text-emerald-300' : 'text-[#073B2A]'
                      }`}
                    >
                      {item.weight}
                    </span>
                  </div>
                  <div
                    className={`w-full h-1.5 rounded-full overflow-hidden ${
                      isVoting ? 'bg-white/20' : 'bg-slate-100'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        isVoting ? 'bg-emerald-400' : 'bg-[#073B2A]'
                      }`}
                      style={{
                        width: isVoting
                          ? '100%'
                          : item.model.includes('SVR')
                          ? '45%'
                          : item.model.includes('Decision')
                          ? '25%'
                          : item.model.includes('Random')
                          ? '20%'
                          : '10%',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
