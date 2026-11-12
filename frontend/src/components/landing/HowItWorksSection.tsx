import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      tag: 'INPUT',
      title: 'Field Parameters',
      desc: 'Weather metrics, soil chemistry, NPK levels, seed cultivar, and management practices.',
      items: ['Rainfall & Temp', 'Soil Texture & NPK', 'Seed Variety'],
    },
    {
      num: '02',
      tag: 'PROCESS',
      title: 'Data Preprocessing',
      desc: 'Feature scaling, categorical encoding, soil normalization, and outlier bounds checking.',
      items: ['Variance Scaling', 'Categorical Dummies', 'Bounds Validation'],
    },
    {
      num: '03',
      tag: 'LEARN',
      title: 'Machine Learning',
      desc: 'Five distinct estimators trained simultaneously to capture linear and non-linear interactions.',
      items: ['Linear Baseline', 'Decision Trees', 'Random Forest & SVR'],
    },
    {
      num: '04',
      tag: 'ENSEMBLE',
      title: 'Voting Regressor',
      desc: 'Empirically weighted meta-estimator aggregating individual sub-model predictions.',
      items: ['45% SVR + 25% DT', '20% RF + 10% LR', 'Minimizes Variance'],
    },
    {
      num: '05',
      tag: 'PREDICT',
      title: 'Sugarcane Yield',
      desc: 'Calibrated production yield estimate with confidence interval and agronomic factor breakdown.',
      items: ['Quintal / Acre', 'Tonnes / Hectare', 'Risk Diagnostic'],
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 px-6 sm:px-8 bg-[#F2FAF5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
              THE METHODOLOGY
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#073B2A] tracking-[-1px] font-normal leading-[1.05]">
            From field conditions to a smarter prediction.
          </h2>
          <p className="mt-4 text-[#4F5A54] text-base sm:text-lg font-sans max-w-xl mx-auto">
            An end-to-end analytical pipeline translating raw agronomic observations into actionable
            harvest intelligence.
          </p>
        </div>

        {/* Horizontal Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-5 relative">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-[22px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(7,59,42,0.08)] bg-white/80 backdrop-blur-md border border-white/70"
            >
              {/* Top: Step Number & Tag */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-3xl lg:text-4xl text-[#073B2A] group-hover:text-emerald-700 transition-colors">
                    {step.num}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] font-sans font-semibold uppercase px-2.5 py-1 rounded-full bg-[#DDF5EA] text-[#073B2A]">
                    {step.tag}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#17201C] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#4F5A54] font-sans">
                  {step.desc}
                </p>
              </div>

              {/* Bottom: Feature tags */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-1.5">
                {step.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#4F5A54] font-medium">
                    <span className="w-1 h-1 rounded-full bg-[#073B2A]/40" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Connecting arrow indicator for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#073B2A] text-white items-center justify-center shadow-md">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
