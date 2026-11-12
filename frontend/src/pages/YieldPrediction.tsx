import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PredictionForm } from '../components/prediction/PredictionForm';
import { SugarcaneTrialForm } from '../components/prediction/SugarcaneTrialForm';
import { PredictionResultCard } from '../components/prediction/PredictionResultCard';
import { ModelInsightCard } from '../components/prediction/ModelInsightCard';
import { FeatureImportanceChart } from '../components/charts/FeatureImportanceChart';
import { GlassCard } from '../components/ui/GlassCard';
import { PredictionInputs, PredictionRecord } from '../types';
import { apiService } from '../services/api';
import { Sprout, BarChart2, ShieldCheck, Download, Share2, Sparkles, Database } from 'lucide-react';

interface YieldPredictionProps {
  onOpenReportModal?: (pred: PredictionRecord) => void;
}

export const YieldPrediction: React.FC<YieldPredictionProps> = ({ onOpenReportModal }) => {
  const { currentPrediction, setCurrentPrediction, addToast, refreshHistory } = useApp();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionMode, setPredictionMode] = useState<'regional' | 'trial'>('trial');

  const handleGenerate = async (inputs: PredictionInputs) => {
    setIsLoading(true);
    try {
      const result = await apiService.predict(inputs);
      setCurrentPrediction(result);
      await refreshHistory();
      addToast(`Prediction generated successfully: ${result.predicted_yield} ${result.unit}`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate prediction from backend', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrialGenerated = async (pred: PredictionRecord) => {
    setCurrentPrediction(pred);
    await refreshHistory();
  };

  const handleDownloadPDF = () => {
    // Open PDF endpoint or trigger print
    window.open(`/api/report/${currentPrediction.id}/pdf`, '_blank');
    addToast('Downloading official YieldVision decision-support PDF report...', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.24em] text-[#064E3B] dark:text-emerald-400 mb-1.5">
            <span>• INDIA</span>
            <span>•</span>
            <span>SUGARCANE</span>
            <span>•</span>
            <span>5-MODEL ENSEMBLE •</span>
          </div>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl lg:text-[42px] text-[#064E3B] dark:text-white tracking-tight leading-tight">
            Crop Yield Prediction
          </h1>
          <p className="text-sm sm:text-base text-[#65756E] dark:text-slate-300 mt-1.5 font-sans">
            Provide environmental and agricultural parameters to generate a machine-learning prediction.
          </p>
        </div>

        {/* Quick Report Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#063F2F] flex items-center gap-2 transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>Download Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* MODEL / DATASET SELECTOR TABS */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/80 dark:bg-forest-950/70 border border-[#064E3B]/10 shadow-sm w-fit">
        <button
          onClick={() => setPredictionMode('trial')}
          className={`
            px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer
            ${predictionMode === 'trial'
              ? 'bg-[#064E3B] text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:text-[#064E3B] hover:bg-[#DDF5EA]/50'
            }
          `}
        >
          <Database className="w-4 h-4" />
          <span>Sugarcane Field Trials (DATA-004)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 font-bold">NEW</span>
        </button>

        <button
          onClick={() => setPredictionMode('regional')}
          className={`
            px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer
            ${predictionMode === 'regional'
              ? 'bg-[#064E3B] text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:text-[#064E3B] hover:bg-[#DDF5EA]/50'
            }
          `}
        >
          <Sprout className="w-4 h-4" />
          <span>Regional Macro Model (States & Districts)</span>
        </button>
      </div>

      {/* TWO-COLUMN LAYOUT MATCHING REFERENCE SCREENSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Input Parameters Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-forest-900 dark:text-white flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              {predictionMode === 'trial' 
                ? 'Sugarcane Multi-Varietal Field Trial Inputs (120 Trials Benchmark)'
                : 'Environmental & Agricultural Inputs'}
            </h2>
            <span className="text-xs font-semibold text-emerald-600">
              Live Validation Active
            </span>
          </div>

          {predictionMode === 'trial' ? (
            <SugarcaneTrialForm
              onGenerateTrial={handleTrialGenerated}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : (
            <PredictionForm onGenerate={handleGenerate} isLoading={isLoading} />
          )}
        </div>

        {/* RIGHT COLUMN: Output Prediction Result & Model Insights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-forest-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Machine Learning Output
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              ID: {currentPrediction.id}
            </span>
          </div>

          {/* Large Result Card */}
          <PredictionResultCard prediction={currentPrediction} />

          {/* Model Insights Card */}
          <ModelInsightCard insights={currentPrediction.insights} />

          {/* Feature Importance Card */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
                  What Influences Yield?
                </h3>
                <p className="text-[10px] text-slate-400">
                  Top feature influence breakdown for {currentPrediction.crop}
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 dark:bg-forest-950">
                Random Forest
              </span>
            </div>

            <FeatureImportanceChart data={currentPrediction.feature_importance} maxItems={8} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
