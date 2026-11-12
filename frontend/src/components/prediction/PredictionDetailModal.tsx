import React from 'react';
import { PredictionRecord } from '../../types';
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  Sprout, 
  Layers, 
  Compass, 
  CloudSun, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import { MetricPill } from '../ui/MetricPill';

interface PredictionDetailModalProps {
  prediction: PredictionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onDuplicate?: (p: PredictionRecord) => void;
}

export const PredictionDetailModal: React.FC<PredictionDetailModalProps> = ({
  prediction,
  isOpen,
  onClose,
  onDuplicate
}) => {
  if (!isOpen || !prediction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.open(`/api/report/${prediction.id}/pdf`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-forest-900 rounded-3xl shadow-2xl border border-emerald-500/20 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-emerald-400 flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-forest-900 dark:text-white">
                  Prediction Details & Decision Report
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
                  {prediction.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generated: {prediction.timestamp} • Unit: {prediction.unit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-forest-800 transition-colors"
              title="Download PDF"
              aria-label="Download PDF report"
            >
              <Download className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-forest-800 transition-colors"
              title="Print Report"
              aria-label="Print report"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top KPI Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-emerald-50/60 dark:bg-forest-950/60 border border-emerald-500/20 text-center">
            <div>
              <p className="text-[10.5px] uppercase font-bold text-slate-400">Predicted Yield</p>
              <p className="text-2xl font-black text-forest-900 dark:text-white mt-0.5">
                {prediction.predicted_yield} <span className="text-xs text-emerald-600">{prediction.unit}</span>
              </p>
            </div>
            <div>
              <p className="text-[10.5px] uppercase font-bold text-slate-400">Confidence</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">{prediction.confidence}%</p>
            </div>
            <div>
              <p className="text-[10.5px] uppercase font-bold text-slate-400">Climate Phase</p>
              <p className="text-xl font-black text-forest-900 dark:text-white mt-0.5">{prediction.climate_state}</p>
            </div>
            <div>
              <p className="text-[10.5px] uppercase font-bold text-slate-400">Risk Assessment</p>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{prediction.risk_level}</p>
            </div>
          </div>

          {/* Input Parameters Used */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" /> Agronomic & Environmental Input Vectors
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800">
                <span className="text-slate-400 block text-[10px]">Crop / Season</span>
                <span className="font-bold">{prediction.crop} • {prediction.season}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800">
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="font-bold">{prediction.location} ({prediction.district})</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800">
                <span className="text-slate-400 block text-[10px]">Rainfall</span>
                <span className="font-bold font-mono">{prediction.inputs.rainfall} mm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800">
                <span className="text-slate-400 block text-[10px]">Temperature</span>
                <span className="font-bold font-mono">{prediction.inputs.temperature}°C</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800">
                <span className="text-slate-400 block text-[10px]">Soil Moisture</span>
                <span className="font-bold font-mono">{prediction.inputs.soil_moisture}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800">
                <span className="text-slate-400 block text-[10px]">Soil pH</span>
                <span className="font-bold font-mono">{prediction.inputs.soil_ph}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800">
                <span className="text-slate-400 block text-[10px]">Nitrogen (N)</span>
                <span className="font-bold font-mono">{prediction.inputs.nitrogen} kg/ha</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800">
                <span className="text-slate-400 block text-[10px]">Pacific ONI Index</span>
                <span className="font-bold font-mono">{prediction.inputs.oni_index > 0 ? `+${prediction.inputs.oni_index}` : prediction.inputs.oni_index}°C</span>
              </div>
            </div>
          </div>

          {/* Model Estimator Outputs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white">
              Candidate Estimator Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {Object.entries(prediction.model_outputs).map(([name, m]) => (
                <div key={name} className="p-3 rounded-xl bg-white dark:bg-forest-950 border border-slate-200 dark:border-forest-800">
                  <div className="flex justify-between font-bold text-forest-900 dark:text-white mb-1">
                    <span className="truncate">{name}</span>
                    <span className="text-emerald-600 font-mono">{m.prediction} T/Ha</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 flex justify-between font-mono">
                    <span>R² {m.r2.toFixed(3)}</span>
                    <span>RMSE {m.rmse.toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Insights & Explanations */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800 space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" /> Agronomic Insights & Mitigation Rationale
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {prediction.insights.summary}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-forest-800">
              <div>
                <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Favorable Drivers
                </p>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  {prediction.insights.positive_factors.map((p, i) => (
                    <li key={i}>• {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Identified Risks
                </p>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  {prediction.insights.risk_factors.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-forest-950 border-t border-emerald-500/10 flex items-center justify-between">
          {onDuplicate && (
            <button
              onClick={() => {
                onDuplicate(prediction);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50 transition-colors"
            >
              Duplicate & Refine Parameters
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-forest-900 hover:bg-forest-800 flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" /> Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
