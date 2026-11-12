import React from 'react';
import { 
  Sprout, 
  CloudSun, 
  Sliders, 
  BarChart3, 
  History, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PlatformOverviewSection: React.FC = () => {
  const { setCurrentPage } = useApp();

  const pages = [
    {
      id: 'predict',
      title: 'Yield Prediction Engine',
      subtitle: 'Multi-Variable Agronomic Inference',
      description:
        'Input cultivar specs, soil NPK, historical precipitation, and evapotranspiration to calculate precise sugarcane tonnage and commercial cane sugar yield.',
      badge: 'Core Engine',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: Sprout,
      actionText: 'Launch Prediction Page',
      featured: true,
    },
    {
      id: 'climate',
      title: 'Climate & Monsoon Intelligence',
      subtitle: 'Spatial Weather & Stress Tracking',
      description:
        'Real-time agro-meteorological monitoring across Indian sugarcane belts. Track monsoon precipitation indices, moisture stress, and temperature deviations.',
      badge: 'Agro-Climate',
      badgeColor: 'bg-blue-100 text-blue-800',
      icon: CloudSun,
      actionText: 'Explore Climate Intelligence',
    },
    {
      id: 'simulator',
      title: 'What-If Scenario Simulator',
      subtitle: 'Dynamic Climate Stress Testing',
      description:
        'Simulate hypothetical micro-climate shocks: adjust rainfall ±30%, test extreme heatwaves, or alter fertilizer regimes to evaluate yield resilience.',
      badge: 'Resilience Modeling',
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: Sliders,
      actionText: 'Run What-If Simulator',
    },
    {
      id: 'models',
      title: 'Model Performance & Benchmarks',
      subtitle: 'Ensemble Validation & Architecture',
      description:
        'Inspect cross-validation benchmarks across Voting Regressor (R² = 0.9993), Random Forest, XGBoost, and Gradient Boosting calibrated on verified Indian trials.',
      badge: 'R² = 0.9993',
      badgeColor: 'bg-purple-100 text-purple-800',
      icon: BarChart3,
      actionText: 'Inspect Model Benchmarks',
    },
    {
      id: 'history',
      title: 'Prediction Registry & Records',
      subtitle: 'Historical Audit & Provenance',
      description:
        'Audit previous sugarcane yield assessments, examine cultivar variances, filter by state, and export comprehensive agronomic reports.',
      badge: 'Audit Trail',
      badgeColor: 'bg-slate-100 text-slate-800',
      icon: History,
      actionText: 'Browse Prediction Registry',
    },
    {
      id: 'analytics',
      title: 'Deep Agronomic Analytics',
      subtitle: 'Spatial Correlation & Distributions',
      description:
        'Multidimensional statistical distributions correlating nitrogen uptake, cane diameter, internode spacing, and final cane sucrose recovery.',
      badge: 'Telemetry',
      badgeColor: 'bg-teal-100 text-teal-800',
      icon: TrendingUp,
      actionText: 'Open Analytics Hub',
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 px-6 sm:px-8 bg-[#FAFCF9] text-left select-none relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
                PLATFORM CAPABILITIES
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#073B2A] tracking-tight leading-[1.05]">
              Dedicated intelligence tools{' '}
              <span className="text-[#6F6F6F] block mt-1">
                for every agronomic decision.
              </span>
            </h2>
          </div>

          <p className="text-sm text-[#4F5A54] max-w-md font-sans leading-relaxed">
            YieldVision organizes its machine learning algorithms and meteorological data into dedicated,
            deep-dive pages tailored for Indian agricultural stakeholders.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <div
                key={page.id}
                className={`group rounded-[24px] p-8 flex flex-col justify-between transition-all duration-300 relative border ${
                  page.featured
                    ? 'bg-gradient-to-b from-white to-[#F2FAF5] border-emerald-500/30 shadow-[0_12px_40px_rgba(7,59,42,0.08)]'
                    : 'bg-white border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(7,59,42,0.07)] hover:border-[#073B2A]/30'
                }`}
              >
                <div>
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#DDF5EA] text-[#073B2A] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#073B2A] group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full ${page.badgeColor}`}
                    >
                      {page.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="text-xs uppercase tracking-wider text-[#6F6F6F] font-sans font-medium mb-1">
                    {page.subtitle}
                  </div>
                  <h3 className="font-serif text-2xl text-[#073B2A] mb-3 leading-tight group-hover:text-[#0B4D38] transition-colors">
                    {page.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#4F5A54] leading-relaxed font-sans mb-8">
                    {page.description}
                  </p>
                </div>

                {/* Direct Action Link to dedicated web page */}
                <button
                  onClick={() => setCurrentPage(page.id)}
                  className={`w-full py-3.5 px-5 rounded-full text-xs font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    page.featured
                      ? 'bg-[#073B2A] text-white hover:bg-[#0B4D38] shadow-md'
                      : 'bg-[#F2FAF5] text-[#073B2A] hover:bg-[#073B2A] hover:text-white'
                  }`}
                >
                  <span>{page.actionText}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
