import React from 'react';
import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingFooter: React.FC = () => {
  const { setCurrentPage } = useApp();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Yield Prediction', onClick: () => setCurrentPage('predict') },
    { label: 'Climate Intelligence', onClick: () => setCurrentPage('climate') },
    { label: 'What-If Simulator', onClick: () => setCurrentPage('simulator') },
    { label: 'Model Benchmarks', onClick: () => setCurrentPage('models') },
    { label: 'Prediction History', onClick: () => setCurrentPage('history') },
    { label: 'Analytics', onClick: () => setCurrentPage('analytics') },
    { label: 'Contact Us', onClick: () => scrollTo('contact') },
  ];

  return (
    <footer className="bg-[#FAFCF9] border-t border-[#073B2A]/10 py-16 sm:py-20 px-6 sm:px-8 text-left select-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-slate-200/80">
          {/* Brand info */}
          <div>
            <div className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#073B2A] font-medium">
              YieldVision
            </div>
            <div className="text-sm font-sans uppercase tracking-[0.24em] text-[#073B2A] font-bold mt-1.5">
              AI AGRICULTURAL INTELLIGENCE
            </div>
            <p className="mt-3.5 text-sm sm:text-base text-[#4F5A54] max-w-md font-sans leading-relaxed">
              Empirical ensemble forecasting engineered for Indian sugarcane agriculture, bridging
              monsoon climate indices with cultivar specific responses.
            </p>
            <div className="mt-3 text-sm text-[#073B2A] font-semibold">
              Pune Research Hub • ICAR-SBI Partner Calibration • advisory@yieldvision.ai
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-7">
            {navLinks.map((lnk) => (
              <button
                key={lnk.label}
                onClick={lnk.onClick}
                className="text-base font-sans font-semibold text-[#17201C] hover:text-[#073B2A] transition-colors cursor-pointer"
              >
                {lnk.label}
              </button>
            ))}
            <button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-[#DDF5EA] text-[#073B2A] hover:bg-[#073B2A] hover:text-white transition-all shadow-sm cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-sans text-[#52635B]">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[#073B2A]">Built with Machine Learning</span>
            <span className="text-slate-300">•</span>
            <span>Sugarcane Research Series</span>
          </div>
          <div>
            © {new Date().getFullYear()} YieldVision. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
