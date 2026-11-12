import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Sprout, MapPin, CloudSun, History, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setCurrentPage, historyList, setCrop, setLocation, addToast } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const pages = [
    { title: 'Overview Dashboard', page: 'dashboard', category: 'Page' },
    { title: 'Crop Yield Prediction', page: 'predict', category: 'Page' },
    { title: 'What-If Yield Simulator', page: 'simulator', category: 'Page' },
    { title: 'Model Performance & Benchmarking', page: 'models', category: 'Page' },
    { title: 'Climate Intelligence & ONI Tracking', page: 'climate', category: 'Page' },
    { title: 'Prediction History', page: 'history', category: 'Page' },
    { title: 'Yield & Environmental Analytics', page: 'analytics', category: 'Page' },
    { title: 'Application Settings', page: 'settings', category: 'Page' },
    { title: 'User Profile & Preferences', page: 'profile', category: 'Page' },
  ];

  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
  const filteredPredictions = historyList.filter(p => 
    p.id.toLowerCase().includes(query.toLowerCase()) ||
    p.location.toLowerCase().includes(query.toLowerCase()) ||
    p.district.toLowerCase().includes(query.toLowerCase()) ||
    p.crop.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectPage = (pageId: string) => {
    setCurrentPage(pageId);
    setIsSearchOpen(false);
    setQuery('');
  };

  const handleSelectPrediction = (cropName: any, locName: string) => {
    setCrop(cropName);
    setLocation(locName);
    setCurrentPage('predict');
    setIsSearchOpen(false);
    setQuery('');
    addToast(`Loaded prediction parameters for ${cropName} (${locName})`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-forest-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-forest-900 rounded-2xl shadow-2xl border border-emerald-500/20 overflow-hidden">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-forest-800">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, predictions, crops, locations, or climate records..."
            className="w-full pl-3 pr-8 bg-transparent text-sm font-medium text-forest-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Pages */}
          {filteredPages.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Navigation Pages
              </p>
              <div className="space-y-1">
                {filteredPages.map(item => (
                  <button
                    key={item.page}
                    onClick={() => handleSelectPage(item.page)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-emerald-50/80 dark:hover:bg-forest-800 transition-colors group"
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-forest-900 dark:group-hover:text-emerald-400">
                      {item.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Predictions History Search */}
          {filteredPredictions.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Historical Predictions & Locations
              </p>
              <div className="space-y-1">
                {filteredPredictions.slice(0, 5).map(pred => (
                  <button
                    key={pred.id}
                    onClick={() => handleSelectPrediction(pred.crop, pred.location)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-emerald-50/80 dark:hover:bg-forest-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">
                          {pred.crop} — {pred.location} ({pred.district})
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {pred.id} • {pred.predicted_yield} T/Ha • {pred.climate_state}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 && filteredPredictions.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No matching pages or predictions found for "{query}".
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-forest-950/60 border-t border-slate-100 dark:border-forest-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press <kbd className="px-1 py-0.5 bg-white dark:bg-forest-900 border rounded text-[10px]">ESC</kbd> to close</span>
          <span>YieldVision Global Search</span>
        </div>
      </div>
    </div>
  );
};
