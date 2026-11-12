import React from 'react';
import { X, Sprout, BookOpen, Layers } from 'lucide-react';

interface HelpInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpInfoModal: React.FC<HelpInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-forest-900 rounded-3xl shadow-2xl border border-emerald-500/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-emerald-400 flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-forest-900 dark:text-white leading-none">
                YieldVision
              </h2>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                Machine Learning for Crop Yield Prediction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Project Abstract */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Executive Overview
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              YieldVision is an AI/ML agricultural intelligence decision-support platform engineered to predict crop yield with calibrated accuracy. By harmonizing meteorological covariates, edaphic soil health parameters, and macro-climate Pacific Oceanic Niño Index (ONI) cycles, YieldVision powers multi-model benchmarking and Voting Regressor ensemble predictions for strategic crop management.
            </p>
          </div>

          {/* ML Models & Flow */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" /> Machine Learning Pipeline
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-bold text-forest-900 dark:text-white">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-forest-800">Linear Regression</div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-forest-800">Decision Tree</div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-forest-800">Random Forest</div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-forest-800">SVR (RBF Kernel)</div>
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                Voting Regressor
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-forest-950/80 border-t border-emerald-500/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-forest-900 hover:bg-forest-800 transition-colors shadow-md"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
