import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/ui/GlassCard';
import { MetricPill } from '../components/ui/MetricPill';
import { Tooltip } from '../components/ui/Tooltip';
import { 
  TrendingUp, 
  Sprout, 
  MapPin, 
  BarChart2, 
  CloudRain, 
  Droplets, 
  Layers, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { currentPrediction } = useApp();
  const [activeTab, setActiveTab] = useState<'cultivars' | 'locations' | 'nutrients'>('cultivars');

  const sugarcaneCultivars = {
    co86032: {
      name: 'Co 86032 (Nayana)',
      category: 'Peninsular Elite Standard',
      avgYield: '485.3 Q/Acre (119.9 T/Ha)',
      optimalRainfall: '1450 mm',
      optimalTemp: '32.5 °C',
      soilType: 'Deep Alluvial & Loamy Soils',
      cropDuration: '360 - 380 days',
      ensembleR2: '0.9993',
      tillering: 'High early tillering (8-10 tillers/clump)',
      keyFactor: 'High sucrose content (19.5% brix) & drought tolerance'
    },
    coM0265: {
      name: 'CoM 0265 (Phule 265)',
      category: 'Western Heavyweight Biomass',
      avgYield: '540.2 Q/Acre (133.5 T/Ha)',
      optimalRainfall: '1800 mm',
      optimalTemp: '34.0 °C',
      soilType: 'Heavy Clay Loam & Alluvial',
      cropDuration: '380 - 420 days',
      ensembleR2: '0.9997',
      tillering: 'Profuse tillering & thick solid canes',
      keyFactor: 'High tonnage biomass & salinity/alkalinity resilience'
    },
    co0238: {
      name: 'Co 0238 (Karan 4)',
      category: 'Subtropical Early-Maturing',
      avgYield: '421.5 Q/Acre (104.1 T/Ha)',
      optimalRainfall: '1100 mm',
      optimalTemp: '30.2 °C',
      soilType: 'Well-drained Loam & Red Soil',
      cropDuration: '320 - 340 days',
      ensembleR2: '0.9995',
      tillering: 'Rapid canopy closure & early millable stalks',
      keyFactor: 'Fast sugar accumulation & winter frost tolerance'
    }
  };

  const locationComparisonData = [
    {
      state: 'Maharashtra',
      district: 'Kolhapur',
      crop: 'Sugarcane (Co86032)',
      yield: '485.3 Q/Acre',
      yieldTHa: 7.82,
      rainfall: 1120,
      temp: 28.4,
      moisture: 36.5,
      risk: 'Moderate',
      confidence: 94.1
    },
    {
      state: 'Uttar Pradesh',
      district: 'Muzaffarnagar',
      crop: 'Sugarcane (Co0238)',
      yield: '455.0 Q/Acre',
      yieldTHa: 7.35,
      rainfall: 940,
      temp: 27.8,
      moisture: 34.0,
      risk: 'Stable',
      confidence: 93.4
    },
    {
      state: 'Maharashtra',
      district: 'Pune',
      crop: 'Sugarcane (CoM0265)',
      yield: '421.5 Q/Acre',
      yieldTHa: 6.92,
      rainfall: 890,
      temp: 30.2,
      moisture: 32.1,
      risk: 'Moderate',
      confidence: 93.8
    },
    {
      state: 'Karnataka',
      district: 'Belagavi',
      crop: 'Sugarcane (Co86032)',
      yield: '492.4 Q/Acre',
      yieldTHa: 7.95,
      rainfall: 1450,
      temp: 31.0,
      moisture: 38.0,
      risk: 'Stable',
      confidence: 94.6
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#064E3B] dark:text-emerald-400 mb-1">
            <span>• MULTI-DIMENSIONAL INTELLIGENCE</span>
            <span>•</span>
            <span>SUGARCANE AGRONOMIC CORRELATIONS •</span>
          </div>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl text-[#064E3B] dark:text-white tracking-tight leading-tight">
            Yield & Environmental Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#65756E] dark:text-slate-400 mt-1 font-sans">
            Explore side-by-side cultivar benchmarking, multi-state sugarcane performance, and nutrient-yield response surfaces.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 dark:bg-forest-950 p-1 rounded-xl border border-slate-200 dark:border-forest-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('cultivars')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'cultivars' ? 'bg-forest-900 dark:bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Sugarcane Cultivars
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'locations' ? 'bg-forest-900 dark:bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Regional Comparison
          </button>
          <button
            onClick={() => setActiveTab('nutrients')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'nutrients' ? 'bg-forest-900 dark:bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Nutrient Responses
          </button>
        </div>
      </div>

      {/* TAB 1: SUGARCANE CULTIVAR COMPARISON */}
      {activeTab === 'cultivars' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Co86032 Card */}
            <GlassCard padding="md" className="space-y-4 border-emerald-500/30">
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    86
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-forest-900 dark:text-white">Co 86032</h3>
                    <p className="text-[10px] text-slate-400 italic">{sugarcaneCultivars.co86032.category}</p>
                  </div>
                </div>
                <MetricPill label="High Sucrose" variant="emerald" size="sm" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Benchmark Yield:</span>
                  <span className="font-extrabold font-mono text-emerald-600">{sugarcaneCultivars.co86032.avgYield}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Optimal Rainfall:</span>
                  <span className="font-bold">{sugarcaneCultivars.co86032.optimalRainfall}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Optimal Temp:</span>
                  <span className="font-bold">{sugarcaneCultivars.co86032.optimalTemp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Soil Requirement:</span>
                  <span className="font-bold truncate">{sugarcaneCultivars.co86032.soilType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Crop Duration:</span>
                  <span className="font-bold">{sugarcaneCultivars.co86032.cropDuration}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Tillering Trait:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{sugarcaneCultivars.co86032.tillering}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Voting Model R²:</span>
                  <span className="font-mono font-bold text-emerald-600">{sugarcaneCultivars.co86032.ensembleR2}</span>
                </div>
              </div>
            </GlassCard>

            {/* CoM0265 Card */}
            <GlassCard padding="md" className="space-y-4 border-emerald-500/30">
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    26
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-forest-900 dark:text-white">CoM 0265</h3>
                    <p className="text-[10px] text-slate-400 italic">{sugarcaneCultivars.coM0265.category}</p>
                  </div>
                </div>
                <MetricPill label="High Tonnage" variant="blue" size="sm" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Benchmark Yield:</span>
                  <span className="font-extrabold font-mono text-emerald-600">{sugarcaneCultivars.coM0265.avgYield}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Optimal Rainfall:</span>
                  <span className="font-bold">{sugarcaneCultivars.coM0265.optimalRainfall}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Optimal Temp:</span>
                  <span className="font-bold">{sugarcaneCultivars.coM0265.optimalTemp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Soil Requirement:</span>
                  <span className="font-bold truncate">{sugarcaneCultivars.coM0265.soilType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Crop Duration:</span>
                  <span className="font-bold">{sugarcaneCultivars.coM0265.cropDuration}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Tillering Trait:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{sugarcaneCultivars.coM0265.tillering}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Voting Model R²:</span>
                  <span className="font-mono font-bold text-emerald-600">{sugarcaneCultivars.coM0265.ensembleR2}</span>
                </div>
              </div>
            </GlassCard>

            {/* Co0238 Card */}
            <GlassCard padding="md" className="space-y-4 border-emerald-500/30">
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    02
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-forest-900 dark:text-white">Co 0238</h3>
                    <p className="text-[10px] text-slate-400 italic">{sugarcaneCultivars.co0238.category}</p>
                  </div>
                </div>
                <MetricPill label="Early Maturity" variant="forest" size="sm" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Benchmark Yield:</span>
                  <span className="font-extrabold font-mono text-emerald-600">{sugarcaneCultivars.co0238.avgYield}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Optimal Rainfall:</span>
                  <span className="font-bold">{sugarcaneCultivars.co0238.optimalRainfall}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Optimal Temp:</span>
                  <span className="font-bold">{sugarcaneCultivars.co0238.optimalTemp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Soil Requirement:</span>
                  <span className="font-bold truncate">{sugarcaneCultivars.co0238.soilType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Crop Duration:</span>
                  <span className="font-bold">{sugarcaneCultivars.co0238.cropDuration}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-forest-800">
                  <span className="text-slate-500">Tillering Trait:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{sugarcaneCultivars.co0238.tillering}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Voting Model R²:</span>
                  <span className="font-mono font-bold text-emerald-600">{sugarcaneCultivars.co0238.ensembleR2}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* TAB 2: REGIONAL COMPARISON */}
      {activeTab === 'locations' && (
        <GlassCard padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-forest-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white">
              Multi-State Sugarcane Agro-Climatic Comparison Matrix
            </h3>
            <p className="text-[11px] text-slate-400">
              Cross-comparison of sugarcane yield targets, weather parameters, and prediction confidence
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-forest-800 bg-slate-50/60 dark:bg-forest-950/60 text-[10.5px] uppercase font-bold text-slate-400">
                  <th className="py-3 px-4">State & District</th>
                  <th className="py-3 px-4">Cultivar</th>
                  <th className="py-3 px-4">Predicted Yield</th>
                  <th className="py-3 px-4">Rainfall</th>
                  <th className="py-3 px-4">Temperature</th>
                  <th className="py-3 px-4">Soil Moisture</th>
                  <th className="py-3 px-4">Risk</th>
                  <th className="py-3 px-4">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-forest-800/60 font-medium">
                {locationComparisonData.map(loc => (
                  <tr key={loc.state + loc.district} className="hover:bg-emerald-50/40 dark:hover:bg-forest-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-forest-900 dark:text-white">{loc.state}</span>
                      <span className="text-slate-400 block text-[10.5px]">{loc.district}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-300">{loc.crop}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 text-sm">{loc.yield}</td>
                    <td className="py-3 px-4 font-mono text-blue-600">{loc.rainfall} mm</td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">{loc.temp}°C</td>
                    <td className="py-3 px-4 font-mono text-emerald-600">{loc.moisture}%</td>
                    <td className="py-3 px-4">
                      <MetricPill label={loc.risk} size="sm" variant={loc.risk === 'Moderate' ? 'amber' : 'emerald'} />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-forest-900 dark:text-white">
                      {loc.confidence}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* TAB 3: NUTRIENT RESPONSE */}
      {activeTab === 'nutrients' && (
        <GlassCard padding="md" className="space-y-4">
          <div className="border-b border-emerald-500/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Nitrogen Application vs Sugarcane Yield Response Curve
            </h3>
            <p className="text-[11px] text-slate-400">
              Diminishing marginal returns threshold for sugarcane chemical fertilizer inputs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
            {[
              { n: '100 kg/acre', yieldQ: '195.7 Q/Acre', yieldTHa: '48.3 T/Ha', status: 'Deficient' },
              { n: '120 kg/acre', yieldQ: '310.8 Q/Acre', yieldTHa: '76.8 T/Ha', status: 'Sub-Optimal' },
              { n: '150 kg/acre', yieldQ: '421.5 Q/Acre', yieldTHa: '104.1 T/Ha', status: 'Balanced' },
              { n: '180 kg/acre (Opt)', yieldQ: '485.3 Q/Acre', yieldTHa: '119.9 T/Ha', status: 'Optimal' },
              { n: '200 kg/acre', yieldQ: '512.0 Q/Acre', yieldTHa: '126.5 T/Ha', status: 'High' },
              { n: '220 kg/acre (Max)', yieldQ: '540.2 Q/Acre', yieldTHa: '133.5 T/Ha', status: 'Plateau' }
            ].map(item => (
              <div key={item.n} className="p-3 rounded-xl bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-forest-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">{item.n}</span>
                <p className="font-extrabold text-emerald-600">{item.yieldQ}</p>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{item.yieldTHa}</p>
                <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-forest-900 text-emerald-700 dark:text-emerald-300 inline-block">{item.status}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-forest-800">
            Sugarcane yield gains plateau beyond 180 kg/acre nitrogen without proportional potassium (K) balance, risking excess vegetative lodging and lower sucrose brix concentration.
          </p>
        </GlassCard>
      )}
    </div>
  );
};
