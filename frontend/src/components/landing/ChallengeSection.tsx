import React from 'react';
import { CloudRain, ThermometerSun, Sprout, AlertCircle } from 'lucide-react';

export const ChallengeSection: React.FC = () => {
  return (
    <section
      id="challenge"
      className="relative py-24 sm:py-36 px-6 sm:px-8 bg-[#FAFCF9] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Text & Challenge Highlights */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
                THE CHALLENGE
              </span>
            </div>

            {/* Editorial Heading */}
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#073B2A] leading-[1.02] tracking-[-1.5px] max-w-xl">
              Climate changes.{' '}
              <span className="text-[#6F6F6F] block mt-1">
                Yield shouldn't be a guessing game.
              </span>
            </h2>

            {/* Editorial Description */}
            <p className="mt-6 sm:mt-8 text-base sm:text-lg leading-relaxed text-[#4F5A54] font-sans font-normal max-w-xl">
              Rainfall, temperature, soil conditions and agricultural practices influence
              sugarcane productivity. YieldVision brings these variables together with machine
              learning to generate data-driven yield predictions.
            </p>

            {/* 3 Challenge Points */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-8 border-t border-[#073B2A]/10">
              <div className="flex flex-col">
                <div className="w-9 h-9 rounded-full bg-[#DDF5EA] flex items-center justify-center text-[#073B2A] mb-3">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div className="font-serif text-xl text-[#073B2A]">Monsoon Shifts</div>
                <p className="text-xs text-[#6F6F6F] mt-1 leading-normal font-sans">
                  Irregular rain distribution during grand growth drastically alters internode weight.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="w-9 h-9 rounded-full bg-[#DDF5EA] flex items-center justify-center text-[#073B2A] mb-3">
                  <ThermometerSun className="w-4 h-4" />
                </div>
                <div className="font-serif text-xl text-[#073B2A]">Thermal Stress</div>
                <p className="text-xs text-[#6F6F6F] mt-1 leading-normal font-sans">
                  Elevated summer extremes spike evapotranspiration and curtail cane elongation.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="w-9 h-9 rounded-full bg-[#DDF5EA] flex items-center justify-center text-[#073B2A] mb-3">
                  <Sprout className="w-4 h-4" />
                </div>
                <div className="font-serif text-xl text-[#073B2A]">NPK Ratios</div>
                <p className="text-xs text-[#6F6F6F] mt-1 leading-normal font-sans">
                  Uncalibrated fertilizer dosing reduces stalk thickness and commercial cane recovery.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Agricultural Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(7,59,42,0.12)] border border-white/60 bg-white">
              <img
                src="/images/sugarcane_field.jpg"
                alt="Indian Sugarcane Crop Growing Under Golden Sunlight"
                className="w-full h-[440px] sm:h-[500px] object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Minimal floating badge over image */}
              <div
                className="absolute bottom-5 left-5 right-5 p-4 rounded-xl text-left"
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              >
                <div className="text-[10px] tracking-[0.2em] uppercase font-sans font-semibold text-[#073B2A]">
                  SACCHARUM OFFICINARUM
                </div>
                <div className="font-serif text-base text-[#17201C] mt-0.5">
                  Multi-Factor Agronomic Modeling
                </div>
                <div className="text-xs text-[#4F5A54] mt-0.5">
                  Correlating 11 agro-climatic parameters across 380-day growth cycles.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
