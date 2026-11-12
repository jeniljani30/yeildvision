import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/ui/GlassCard';
import { MetricPill } from '../components/ui/MetricPill';
import { PredictionRecord } from '../types';
import { PredictionDetailModal } from '../components/prediction/PredictionDetailModal';
import { apiService } from '../services/api';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  FileText,
  Loader2,
  Eye, 
  Trash2, 
  Copy, 
  Sprout, 
  ArrowUpDown,
  ChevronRight
} from 'lucide-react';

export const PredictionHistory: React.FC = () => {
  const { historyList, deleteHistoryItem, setCurrentPage, setCrop, setLocation, setSeason, addToast } = useApp();
  
  const [search, setSearch] = useState('');
  const [filterCrop, setFilterCrop] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterClimate, setFilterClimate] = useState('All');
  const [sortField, setSortField] = useState<'timestamp' | 'predicted_yield' | 'confidence'>('timestamp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const [selectedRecord, setSelectedRecord] = useState<PredictionRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Filter logic
  let filtered = historyList.filter(item => {
    if (filterCrop !== 'All' && item.crop !== filterCrop) return false;
    if (filterLocation !== 'All' && item.location !== filterLocation) return false;
    if (filterClimate !== 'All' && item.climate_state !== filterClimate) return false;
    if (search) {
      const q = search.toLowerCase();
      const match = item.id.toLowerCase().includes(q) ||
                    item.location.toLowerCase().includes(q) ||
                    item.district?.toLowerCase().includes(q) ||
                    item.crop.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortField === 'timestamp') {
      cmp = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortField === 'predicted_yield') {
      cmp = b.predicted_yield - a.predicted_yield;
    } else if (sortField === 'confidence') {
      cmp = b.confidence - a.confidence;
    }
    return sortAsc ? -cmp : cmp;
  });

  const handleDuplicate = (p: PredictionRecord) => {
    setCrop(p.crop);
    setLocation(p.location);
    setSeason(p.season);
    setCurrentPage('predict');
    addToast(`Parameters loaded for ${p.crop} (${p.location}) into Prediction Engine`, 'info');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Crop', 'Location', 'District', 'Season', 'Yield_THa', 'Confidence', 'Model', 'Climate_State', 'Risk'];
    const rows = filtered.map(r => [
      r.id,
      r.timestamp,
      r.crop,
      r.location,
      r.district,
      r.season,
      r.predicted_yield,
      `${r.confidence}%`,
      r.model_used,
      r.climate_state,
      r.risk_level
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `YieldVision_Prediction_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Prediction history exported to CSV', 'success');
  };

  const handleExportPDF = async () => {
    if (filtered.length === 0) {
      addToast('No prediction records match the current filter to export', 'warning');
      return;
    }
    setIsExportingPdf(true);
    addToast('Generating official Prediction History PDF report...', 'info');
    try {
      await apiService.downloadHistoryPdf(filtered, {
        crop: filterCrop,
        location: filterLocation,
        climate: filterClimate,
        search
      });
      addToast('Prediction history PDF exported successfully', 'success');
    } catch (e) {
      console.error(e);
      addToast('PDF download failed. Generating printable report...', 'warning');
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#064E3B] dark:text-emerald-400 mb-1">
            <span>• HISTORICAL AUDIT & LOGS</span>
            <span>•</span>
            <span>PREDICTION ARCHIVE •</span>
          </div>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl text-[#064E3B] dark:text-white tracking-tight leading-tight">
            Prediction History
          </h1>
          <p className="text-xs sm:text-sm text-[#65756E] dark:text-slate-400 mt-1 font-sans">
            Review, filter, inspect, and export previous multi-model yield predictions and environmental logs.
          </p>
        </div>

        {/* Export Buttons: CSV & PDF */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-forest-900 dark:bg-emerald-700 hover:bg-forest-800 dark:hover:bg-emerald-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            title="Export filtered records as CSV spreadsheet"
          >
            <Download className="w-4 h-4 text-emerald-400 dark:text-emerald-300" />
            <span>Export History (CSV)</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-emerald-500/30 disabled:opacity-60"
            title="Export filtered records as official PDF audit report"
          >
            {isExportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <FileText className="w-4 h-4 text-emerald-100" />
            )}
            <span>{isExportingPdf ? 'Exporting PDF...' : 'Export History (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <GlassCard padding="md" className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, location, or district..."
              className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-forest-950 border border-slate-200 dark:border-forest-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-forest-900 dark:text-white"
            />
          </div>

          {/* Filter Crop */}
          <div>
            <select
              value={filterCrop}
              onChange={(e) => setFilterCrop(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Crops</option>
              <option value="Sugarcane">Sugarcane Only</option>
            </select>
          </div>

          {/* Filter Location */}
          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Locations</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Punjab">Punjab</option>
            </select>
          </div>

          {/* Filter Climate State */}
          <div>
            <select
              value={filterClimate}
              onChange={(e) => setFilterClimate(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white dark:bg-forest-950 border border-slate-200 dark:border-forest-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Climate States</option>
              <option value="Neutral">Neutral Phase</option>
              <option value="El Niño">El Niño Phase</option>
              <option value="La Niña">La Niña Phase</option>
            </select>
          </div>
        </div>

        {/* Results counter and quick sort buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-forest-800 text-xs text-slate-500">
          <span>Showing <strong className="text-forest-900 dark:text-white">{filtered.length}</strong> prediction records</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Sort by:</span>
            <button
              onClick={() => { setSortField('timestamp'); setSortAsc(prev => !prev); }}
              className={`px-2 py-1 rounded-lg border text-[11px] font-semibold ${sortField === 'timestamp' ? 'bg-emerald-50 dark:bg-forest-900 text-emerald-700 border-emerald-500/30' : 'border-slate-200 dark:border-forest-800'}`}
            >
              Date {sortField === 'timestamp' && (sortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => { setSortField('predicted_yield'); setSortAsc(prev => !prev); }}
              className={`px-2 py-1 rounded-lg border text-[11px] font-semibold ${sortField === 'predicted_yield' ? 'bg-emerald-50 dark:bg-forest-900 text-emerald-700 border-emerald-500/30' : 'border-slate-200 dark:border-forest-800'}`}
            >
              Yield {sortField === 'predicted_yield' && (sortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => { setSortField('confidence'); setSortAsc(prev => !prev); }}
              className={`px-2 py-1 rounded-lg border text-[11px] font-semibold ${sortField === 'confidence' ? 'bg-emerald-50 dark:bg-forest-900 text-emerald-700 border-emerald-500/30' : 'border-slate-200 dark:border-forest-800'}`}
            >
              Confidence {sortField === 'confidence' && (sortAsc ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* PREDICTIONS TABLE */}
      <GlassCard padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-forest-800 bg-slate-50/70 dark:bg-forest-950/70 text-[10.5px] uppercase font-bold text-slate-400">
                <th className="py-3 px-4">Date / ID</th>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Season</th>
                <th className="py-3 px-4">Predicted Yield</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Model Used</th>
                <th className="py-3 px-4">Climate</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-forest-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                    No matching prediction records found.
                  </td>
                </tr>
              ) : (
                filtered.map(row => (
                  <tr key={row.id} className="hover:bg-emerald-50/40 dark:hover:bg-forest-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-forest-900 dark:text-white font-mono text-[11px]">
                        {row.id}
                      </div>
                      <div className="text-[10px] text-slate-400">{row.timestamp}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{row.crop}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {row.location} ({row.district})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {row.season}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-extrabold text-forest-900 dark:text-white text-sm">
                        {row.predicted_yield}
                      </span>
                      <span className="text-[10.5px] text-emerald-600 font-semibold ml-1">
                        {row.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {row.confidence}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {row.model_used}
                    </td>
                    <td className="py-3 px-4">
                      <MetricPill
                        label={row.climate_state}
                        size="sm"
                        variant={row.climate_state === 'El Niño' ? 'red' : row.climate_state === 'La Niña' ? 'blue' : 'gray'}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <MetricPill
                        label={row.risk_level}
                        size="sm"
                        variant={row.risk_level === 'High' ? 'red' : row.risk_level === 'Moderate' ? 'amber' : 'emerald'}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedRecord(row);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-forest-800 transition-colors"
                          title="View Details"
                          aria-label="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(row)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-forest-800 transition-colors"
                          title="Duplicate & Edit"
                          aria-label="Duplicate and edit"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(row.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-forest-800 transition-colors"
                          title="Delete Record"
                          aria-label="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* DETAIL MODAL */}
      <PredictionDetailModal
        prediction={selectedRecord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDuplicate={handleDuplicate}
      />
    </div>
  );
};
