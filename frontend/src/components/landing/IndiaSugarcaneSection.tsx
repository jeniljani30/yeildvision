import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Layers, TrendingUp, BarChart3, Database } from 'lucide-react';
import { apiService } from '../../services/api';
import { IndiaSugarcaneOverview, IndiaSugarcaneExplorer } from '../../types';

export const IndiaSugarcaneSection: React.FC = () => {
  const [overview, setOverview] = useState<IndiaSugarcaneOverview | null>(null);
  const [explorer, setExplorer] = useState<IndiaSugarcaneExplorer | null>(null);
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Ahmadnagar');
  const [selectedYear, setSelectedYear] = useState<number>(2014);
  const [selectedSeason, setSelectedSeason] = useState<string>('Whole Year');
  const [loading, setLoading] = useState(false);

  // Load initial overview and explorer data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [ovData, expData] = await Promise.all([
          apiService.getIndiaSugarcaneOverview(),
          apiService.getIndiaSugarcaneExplorer({ state: 'Maharashtra' }),
        ]);

        if (isMounted) {
          if (ovData) setOverview(ovData);
          if (expData) {
            setExplorer(expData);
            setSelectedState(expData.selected.state);
            setSelectedDistrict(expData.selected.district);
            setSelectedYear(expData.selected.year);
            setSelectedSeason(expData.selected.season);
          }
        }
      } catch (e) {
        console.warn('Could not load India sugarcane dataset:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle State Change -> Updates District options
  const handleStateChange = async (newState: string) => {
    setSelectedState(newState);
    setLoading(true);
    try {
      const data = await apiService.getIndiaSugarcaneExplorer({ state: newState });
      if (data) {
        setExplorer(data);
        setSelectedDistrict(data.selected.district);
        setSelectedYear(data.selected.year);
        setSelectedSeason(data.selected.season);
      }
    } catch (e) {
      console.warn('Error fetching districts for state:', e);
    } finally {
      setLoading(false);
    }
  };

  // Handle District Change -> Updates available Years
  const handleDistrictChange = async (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    setLoading(true);
    try {
      const data = await apiService.getIndiaSugarcaneExplorer({
        state: selectedState,
        district: newDistrict,
      });
      if (data) {
        setExplorer(data);
        setSelectedYear(data.selected.year);
        setSelectedSeason(data.selected.season);
      }
    } catch (e) {
      console.warn('Error fetching years for district:', e);
    } finally {
      setLoading(false);
    }
  };

  // Handle Year Change -> Updates available Seasons
  const handleYearChange = async (newYearStr: string) => {
    const yr = Number(newYearStr);
    setSelectedYear(yr);
    setLoading(true);
    try {
      const data = await apiService.getIndiaSugarcaneExplorer({
        state: selectedState,
        district: selectedDistrict,
        year: yr,
      });
      if (data) {
        setExplorer(data);
        setSelectedSeason(data.selected.season);
      }
    } catch (e) {
      console.warn('Error fetching season for year:', e);
    } finally {
      setLoading(false);
    }
  };

  // Handle Season Change
  const handleSeasonChange = async (newSeason: string) => {
    setSelectedSeason(newSeason);
    setLoading(true);
    try {
      const data = await apiService.getIndiaSugarcaneExplorer({
        state: selectedState,
        district: selectedDistrict,
        year: selectedYear,
        season: newSeason,
      });
      if (data) {
        setExplorer(data);
      }
    } catch (e) {
      console.warn('Error updating season metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  const metrics = explorer?.metrics || {
    area: 122000.0,
    production: 11761000.0,
    historical_yield: 96.4,
    area_unit: 'Hectares',
    production_unit: 'Metric Tonnes',
    yield_unit: 'Tonnes/Hectare',
  };

  const timeseries = explorer?.timeseries || [];

  return (
    <section
      id="intelligence"
      className="py-24 sm:py-36 px-6 sm:px-8 bg-[#F2FAF5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
              NATIONAL AGRICULTURAL CORPUS
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#073B2A] tracking-[-1px] font-normal leading-[1.05]">
            Built for India's sugarcane landscape.
          </h2>
          <p className="mt-4 text-[#4F5A54] text-base sm:text-lg font-sans max-w-2xl mx-auto">
            Grounded in comprehensive Indian sugarcane harvest records spanning major sugar-producing
            states, agro-climatic zones, and longitudinal district registries.
          </p>
        </div>

        {/* Interactive Explorer Panel */}
        <div className="rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/80 p-6 sm:p-10 shadow-[0_20px_50px_rgba(7,59,42,0.06)]">
          {/* Top Bar: Cascading Dynamic Dropdowns */}
          <div className="border-b border-slate-100 pb-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#073B2A] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Dataset Query Engine (Sugarcane)</span>
              </span>
              {loading && (
                <span className="text-xs text-[#073B2A] animate-pulse font-medium">
                  Syncing records...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. State Dropdown */}
              <div>
                <label className="block text-xs font-sans font-medium text-[#4F5A54] mb-1.5">
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-sans font-medium text-[#17201C] focus:outline-none focus:ring-2 focus:ring-[#073B2A]/30 focus:border-[#073B2A] shadow-sm transition-all"
                >
                  {(explorer?.states || ['Maharashtra', 'Uttar Pradesh', 'Tamil Nadu', 'Karnataka']).map(
                    (st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* 2. District Dropdown (updates when state changes) */}
              <div>
                <label className="block text-xs font-sans font-medium text-[#4F5A54] mb-1.5">
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-sans font-medium text-[#17201C] focus:outline-none focus:ring-2 focus:ring-[#073B2A]/30 focus:border-[#073B2A] shadow-sm transition-all"
                >
                  {(explorer?.districts || ['Ahmadnagar', 'Kolhapur', 'Pune', 'Sangli']).map(
                    (dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* 3. Year Dropdown (updates when district changes) */}
              <div>
                <label className="block text-xs font-sans font-medium text-[#4F5A54] mb-1.5">
                  Crop Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-sans font-medium text-[#17201C] focus:outline-none focus:ring-2 focus:ring-[#073B2A]/30 focus:border-[#073B2A] shadow-sm transition-all"
                >
                  {(explorer?.years || [2014, 2013, 2012, 2011, 2010]).map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Season Dropdown (updates when year changes) */}
              <div>
                <label className="block text-xs font-sans font-medium text-[#4F5A54] mb-1.5">
                  Season
                </label>
                <select
                  value={selectedSeason}
                  onChange={(e) => handleSeasonChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-sans font-medium text-[#17201C] focus:outline-none focus:ring-2 focus:ring-[#073B2A]/30 focus:border-[#073B2A] shadow-sm transition-all"
                >
                  {(explorer?.seasons || ['Whole Year']).map((sn) => (
                    <option key={sn} value={sn}>
                      {sn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actual Dataset Values Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Area */}
            <div className="p-6 rounded-2xl bg-[#FAFCF9] border border-[#073B2A]/10 text-left">
              <span className="text-[11px] font-sans uppercase tracking-wider text-[#6F6F6F] font-medium">
                CULTIVATED AREA
              </span>
              <div className="mt-2 font-serif text-3xl sm:text-4xl text-[#073B2A]">
                {metrics.area.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-[#4F5A54] font-sans font-medium">
                {metrics.area_unit || 'Hectares'}
              </div>
            </div>

            {/* Production */}
            <div className="p-6 rounded-2xl bg-[#FAFCF9] border border-[#073B2A]/10 text-left">
              <span className="text-[11px] font-sans uppercase tracking-wider text-[#6F6F6F] font-medium">
                ANNUAL PRODUCTION
              </span>
              <div className="mt-2 font-serif text-3xl sm:text-4xl text-[#073B2A]">
                {metrics.production.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-[#4F5A54] font-sans font-medium">
                {metrics.production_unit || 'Metric Tonnes'}
              </div>
            </div>

            {/* Historical Yield */}
            <div className="p-6 rounded-2xl bg-[#073B2A] text-white border border-[#0B4D38] text-left shadow-lg">
              <span className="text-[11px] font-sans uppercase tracking-wider text-emerald-300 font-medium">
                HISTORICAL RECORDED YIELD
              </span>
              <div className="mt-2 font-serif text-3xl sm:text-4xl text-white">
                {metrics.historical_yield.toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-emerald-200/80 font-sans font-medium">
                {metrics.yield_unit || 'Tonnes / Hectare'}
              </div>
            </div>
          </div>

          {/* Historical Timeseries Visualization for Selected District */}
          {timeseries.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="font-serif text-xl text-[#073B2A]">
                  Historical Yield Trajectory ({selectedDistrict}, {selectedState})
                </div>
                <div className="text-xs text-[#6F6F6F] font-sans">
                  From {timeseries[0]?.Crop_Year} to {timeseries[timeseries.length - 1]?.Crop_Year}
                </div>
              </div>

              {/* Dynamic Bar/Trend visualization */}
              <div className="h-44 sm:h-52 w-full flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 px-2 overflow-x-auto">
                {timeseries.map((pt) => {
                  const maxYield = Math.max(...timeseries.map((t) => t.yield), 100);
                  const heightPct = Math.min(100, Math.max(15, (pt.yield / maxYield) * 100));
                  const isCur = pt.Crop_Year === selectedYear;

                  return (
                    <div
                      key={pt.Crop_Year}
                      onClick={() => handleYearChange(String(pt.Crop_Year))}
                      className="group flex-1 min-w-[28px] sm:min-w-[34px] flex flex-col items-center justify-end h-full cursor-pointer"
                    >
                      <div className="text-[10px] text-[#4F5A54] opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-sans">
                        {pt.yield}
                      </div>
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isCur
                            ? 'bg-[#073B2A] shadow-md'
                            : 'bg-[#DDF5EA] group-hover:bg-emerald-400'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span
                        className={`text-[9px] mt-1.5 font-sans font-medium ${
                          isCur ? 'text-[#073B2A] font-bold' : 'text-[#6F6F6F]'
                        }`}
                      >
                        {String(pt.Crop_Year).slice(-2)}'
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top States Benchmark from real dataset */}
          {overview && overview.top_states && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-left">
              <div className="font-serif text-xl text-[#073B2A] mb-3">
                Top Sugarcane Producing States (India)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {overview.top_states.slice(0, 4).map((st) => (
                  <button
                    key={st.State_Name}
                    onClick={() => handleStateChange(st.State_Name)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      selectedState === st.State_Name
                        ? 'border-[#073B2A] bg-[#DDF5EA]/40'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="font-serif text-sm text-[#073B2A]">{st.State_Name}</div>
                    <div className="text-[11px] text-[#6F6F6F] mt-0.5">
                      Avg Yield: <strong className="text-[#17201C]">{st.avg_yield} T/Ha</strong>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
