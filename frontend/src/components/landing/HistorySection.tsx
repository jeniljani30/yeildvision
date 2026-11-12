import React, { useEffect, useState } from 'react';
import {
  History,
  FileText,
  X,
  ExternalLink,
  Download,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { apiService } from '../../services/api';
import { PredictionRecord } from '../../types';

export const HistorySection: React.FC = () => {
  const [historyRecords, setHistoryRecords] = useState<PredictionRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<PredictionRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      try {
        setLoading(true);
        const records = await apiService.getPredictions();
        if (records && isMounted) {
          setHistoryRecords(records.slice(0, 10));
        }
      } catch (e) {
        console.warn('Failed to load predictions history:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="history"
      className="py-24 sm:py-36 px-6 sm:px-8 bg-[#FAFCF9] relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
              AUDIT LOG & ARCHIVE
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#073B2A] tracking-[-1px] font-normal leading-[1.05]">
            Your prediction history.
          </h2>
          <p className="mt-4 text-[#4F5A54] text-base sm:text-lg font-sans max-w-xl mx-auto">
            Review past harvest projections, inspection inputs, model breakdowns, and download
            scientific verification reports.
          </p>
        </div>

        {/* History Table Card */}
        <div className="rounded-[28px] bg-white/90 backdrop-blur-xl border border-white/80 p-6 sm:p-10 shadow-[0_20px_50px_rgba(7,59,42,0.06)] text-left">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#073B2A] flex items-center gap-2">
              <History className="w-4 h-4 text-[#073B2A]" />
              <span>Historical Prediction Registry ({historyRecords.length} Records)</span>
            </span>
            <span className="text-xs text-[#6F6F6F] font-sans">
              Click any entry to view full input parameters
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" role="table">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-sans uppercase tracking-wider text-[#6F6F6F]">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">State & Location</th>
                  <th className="py-3 px-4">District / Cultivar</th>
                  <th className="py-3 px-4">Year / Season</th>
                  <th className="py-3 px-4">Predicted Yield</th>
                  <th className="py-3 px-4">Ensemble Model</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-sans">
                {historyRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#6F6F6F]">
                      No predictions recorded yet. Run a prediction above to build your history!
                    </td>
                  </tr>
                ) : (
                  historyRecords.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedRecord(item)}
                      className="group cursor-pointer hover:bg-[#F2FAF5] transition-colors"
                    >
                      <td className="py-4 px-4 text-xs text-[#17201C] font-mono">
                        {item.timestamp ? item.timestamp.split(' ')[0] : '2026-09-28'}
                      </td>
                      <td className="py-4 px-4 font-medium text-[#17201C]">
                        {item.location || 'Maharashtra'}
                      </td>
                      <td className="py-4 px-4 text-xs text-[#4F5A54]">
                        {item.district || 'Kolhapur'}
                      </td>
                      <td className="py-4 px-4 text-xs text-[#6F6F6F]">
                        {item.year || 2025} • {item.season || 'Annual'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-serif text-lg font-medium text-[#073B2A]">
                          {item.predicted_yield} {item.unit || 'Q/Acre'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-[#DDF5EA] text-[#073B2A] font-medium text-[11px]">
                          {item.model_used || 'Voting Regressor'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-lg text-xs font-sans text-[#073B2A] group-hover:bg-[#073B2A] group-hover:text-white transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Glassmorphic Detail Panel / Modal */}
        {selectedRecord && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B2A]/40 backdrop-blur-md animate-fade-rise"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white shadow-[0_25px_70px_rgba(7,59,42,0.25)] p-6 sm:p-10 text-left">
              {/* Close Button */}
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#17201C] transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="pb-6 border-b border-slate-100">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#073B2A]">
                  RECORD TELEMETRY • {selectedRecord.id}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#073B2A] mt-1">
                  Prediction Telemetry & Diagnostics
                </h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#6F6F6F] font-sans">
                  <span>Timestamp: {selectedRecord.timestamp}</span>
                  <span>Location: {selectedRecord.location}</span>
                  <span>Confidence: {selectedRecord.confidence}%</span>
                </div>
              </div>

              {/* Yield Output Banner */}
              <div className="my-6 p-6 rounded-2xl bg-[#073B2A] text-white flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-emerald-300 font-sans">
                    PROJECTED YIELD
                  </div>
                  <div className="font-serif text-4xl sm:text-5xl text-white mt-1">
                    {selectedRecord.predicted_yield} {selectedRecord.unit || 'Quintal / Acre'}
                  </div>
                  <div className="text-xs text-emerald-100/90 font-sans mt-1">
                    Model: {selectedRecord.model_used}
                  </div>
                </div>

                <a
                  href={apiService.getReportPdfUrl(selectedRecord.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#073B2A] text-xs font-sans font-semibold hover:bg-emerald-50 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </a>
              </div>

              {/* Input Parameters Section */}
              <div className="space-y-4">
                <div className="font-serif text-xl text-[#073B2A]">
                  Original Prediction Inputs
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedRecord.inputs &&
                    Object.entries(selectedRecord.inputs).map(([key, value]) => {
                      if (typeof value === 'object' || value === undefined) return null;
                      return (
                        <div
                          key={key}
                          className="p-3 rounded-xl bg-[#FAFCF9] border border-slate-100 text-left"
                        >
                          <div className="text-[10px] uppercase font-sans text-[#6F6F6F] truncate">
                            {key.replace(/_/g, ' ')}
                          </div>
                          <div className="font-sans font-semibold text-sm text-[#17201C] mt-0.5 truncate">
                            {String(value)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Individual Model Outputs */}
              {selectedRecord.model_outputs && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="font-serif text-xl text-[#073B2A] mb-3">
                    Sub-Model Disaggregation
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(selectedRecord.model_outputs).map(([mName, mData]: [string, any]) => (
                      <div
                        key={mName}
                        className="p-3 rounded-xl bg-[#FAFCF9] border border-slate-100"
                      >
                        <div className="text-[10px] text-[#6F6F6F] font-sans truncate">
                          {mName.replace('Support Vector Regressor (SVR)', 'SVR')}
                        </div>
                        <div className="font-serif text-xl text-[#073B2A] mt-0.5">
                          {mData.prediction}
                        </div>
                        <div className="text-[10px] text-[#6F6F6F]">
                          R²: {mData.r2}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer actions inside modal */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={apiService.getReportPdfUrl(selectedRecord.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="sm:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#073B2A] text-white text-xs font-sans font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Report</span>
                </a>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="ml-auto px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-sans font-medium text-[#17201C] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
