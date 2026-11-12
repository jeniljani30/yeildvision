import React from 'react';
import { X, Sprout, Cpu, ShieldCheck, Database, Award, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentPage, isAuthenticated, setIsLoginModalOpen, setLoginRedirectPage } = useApp();

  if (!isOpen) return null;

  const handleLaunch = () => {
    onClose();
    if (isAuthenticated) {
      setCurrentPage('predict');
    } else {
      setLoginRedirectPage('predict');
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#063F2F]/40 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl rounded-[28px] bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_rgba(6,63,47,0.18)] p-7 sm:p-9 text-left z-10 animate-fade-rise">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-[#063F2F] hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close about modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Eyebrow & Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDF5EA] text-[#064E3B] text-[11px] font-semibold tracking-wider uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
          <span>ABOUT YIELDVISION</span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl text-[#063F2F] tracking-tight leading-tight">
          AI Agricultural Intelligence for Indian Sugarcane
        </h3>

        <p className="mt-3 text-sm text-[#65756E] leading-relaxed font-sans">
          YieldVision is an agro-meteorological machine learning platform engineered specifically for sugarcane agriculture across India's primary production belts in Maharashtra, Uttar Pradesh, Karnataka, and Tamil Nadu.
        </p>

        {/* 3 Pillars */}
        <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 text-xs font-sans">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#DDF5EA] text-[#064E3B] flex items-center justify-center shrink-0 mt-0.5">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[#10231D] text-sm block">5-Model Ensemble Architecture</span>
              <p className="text-[#65756E] mt-0.5 leading-normal">
                Powered by a weighted Voting Regressor combining Support Vector Regression, Random Forest, Decision Tree, and Linear Regression with verified R² = 0.9993.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#DDF5EA] text-[#064E3B] flex items-center justify-center shrink-0 mt-0.5">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[#10231D] text-sm block">Ground-Truth Field Trials</span>
              <p className="text-[#65756E] mt-0.5 leading-normal">
                Calibrated against 120 verified ICAR-SBI controlled field trials tracking soil NPK, seasonal moisture, cane varieties (Co86032, CoM0265, Co0238), and climate anomalies.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#DDF5EA] text-[#064E3B] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[#10231D] text-sm block">Decision Support for Sugar Mills & Growers</span>
              <p className="text-[#65756E] mt-0.5 leading-normal">
                Actionable predictions in Tonnage/Hectare (T/Ha) and Quintal/Acre with dynamic What-If climate stress simulation.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-[#65756E]">
            Research Series • Version 2.4.0
          </span>
          <button
            onClick={handleLaunch}
            className="inline-flex items-center gap-2 rounded-full bg-[#063F2F] hover:bg-[#064E3B] text-white text-xs font-semibold px-5 py-2.5 transition-all shadow-sm cursor-pointer"
          >
            <span>Launch Prediction Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
