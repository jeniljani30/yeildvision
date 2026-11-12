import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FinalCtaSectionProps {
  onPredictClick?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onPredictClick }) => {
  const handleClick = () => {
    if (onPredictClick) {
      onPredictClick();
    } else {
      document.getElementById('prediction')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-32 sm:py-44 px-6 sm:px-8 overflow-hidden select-none">
      {/* Background Image Container with Aerial Sugarcane Farmland */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <img
          src="/images/sugarcane_aerial_golden.jpg"
          alt="Aerial Indian Sugarcane Plantation with Morning Sunlight"
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Soft Editorial Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(250,252,249,0.92) 0%, rgba(250,252,249,0.65) 30%, rgba(7,59,42,0.40) 70%, rgba(7,59,42,0.85) 100%)',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-pill mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#073B2A]">
            INTELLIGENT AGRICULTURE
          </span>
        </div>

        <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-[#073B2A] tracking-[-2px] sm:tracking-[-2.5px] leading-[0.96] max-w-3xl">
          Turn agricultural data{' '}
          <span className="text-[#6F6F6F] block mt-1">
            into better decisions.
          </span>
        </h2>

        <p className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-[#4F5A54] font-sans font-normal px-4">
          Explore YieldVision's machine learning intelligence for sugarcane yield prediction
          across India.
        </p>

        <div className="mt-8 sm:mt-10">
          <button
            onClick={handleClick}
            className="group relative rounded-full px-12 py-5 text-sm sm:text-base font-sans font-semibold bg-[#073B2A] text-white transition-all duration-300 hover:scale-[1.03] hover:bg-[#0B4D38] shadow-[0_12px_36px_rgba(7,59,42,0.30)] hover:shadow-[0_16px_48px_rgba(7,59,42,0.42)] flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#073B2A]/40"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Launch Yield Predictor</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
