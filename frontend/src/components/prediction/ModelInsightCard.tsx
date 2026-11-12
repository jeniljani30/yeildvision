import React from 'react';
import { ModelInsights } from '../../types';
import { CheckCircle, AlertTriangle, Lightbulb, Compass, Award } from 'lucide-react';

interface ModelInsightCardProps {
  insights: ModelInsights;
}

export const ModelInsightCard: React.FC<ModelInsightCardProps> = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="p-5 rounded-2xl bg-white/70 dark:bg-forest-900/60 border border-emerald-500/15 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-forest-900 dark:text-white">
              Model Insight & Agronomic Assessment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic agronomic rule engine & feature coefficient evaluation
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
          Calibrated
        </span>
      </div>

      {/* Summary Narrative */}
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed bg-emerald-50/50 dark:bg-forest-950/40 p-3.5 rounded-xl border border-emerald-500/10">
        {insights.summary}
      </p>

      {/* Positive Factors & Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Positive Factors */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-800 dark:text-emerald-400">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Favorable Yield Drivers</span>
          </div>
          <ul className="space-y-2">
            {insights.positive_factors.map((factor, i) => (
              <li key={i} className="text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-800 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Identified Risk Factors</span>
          </div>
          <ul className="space-y-2">
            {insights.risk_factors.map((risk, i) => (
              <li key={i} className="text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Confidence explanation */}
      {insights.confidence_explanation && (
        <div className="pt-2.5 border-t border-slate-100 dark:border-forest-800/80 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong className="text-slate-800 dark:text-slate-200">Confidence Logic:</strong> {insights.confidence_explanation}</span>
        </div>
      )}
    </div>
  );
};
