import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/ui/GlassCard';
import { MetricPill } from '../components/ui/MetricPill';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Award, 
  Sprout, 
  MapPin, 
  History, 
  Sparkles,
  Calendar
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { historyList, scenarios, addToast } = useApp();

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
          <span>RESEARCH IDENTITY</span>
          <span>•</span>
          <span>USER PROFILE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 dark:text-white tracking-tight">
          Agronomist Profile & Research Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your active research session, saved model predictions, and research authorizations.
        </p>
      </div>

      {/* USER HERO CARD */}
      <GlassCard padding="lg" className="border-emerald-500/25">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-3xl bg-forest-900 text-white dark:bg-emerald-500 dark:text-forest-950 font-black text-2xl flex items-center justify-center shadow-xl ring-4 ring-emerald-500/20">
            KK
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-forest-900 dark:text-white">Karina Kesur</h2>
              <MetricPill label="Lead Researcher" variant="emerald" size="sm" />
              <MetricPill label="Agronomist Lead" variant="forest" size="sm" />
            </div>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>karina.kesur@yieldvision.ai</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
              Research Focus: Multi-variate agro-meteorological modeling, Pacific Niño index teleconnections, and soft voting regressor ensembles for subtropical crop yield forecasting.
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-500/10 text-center text-xs">
          <div>
            <span className="text-[10.5px] uppercase font-bold text-slate-400">Total Predictions</span>
            <p className="text-2xl font-black text-forest-900 dark:text-white mt-0.5">{historyList.length}</p>
          </div>
          <div>
            <span className="text-[10.5px] uppercase font-bold text-slate-400">Saved Scenarios</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{scenarios.length}</p>
          </div>
          <div>
            <span className="text-[10.5px] uppercase font-bold text-slate-400">Active Crops</span>
            <p className="text-xl font-black text-forest-900 dark:text-white mt-0.5">Sugarcane (Single Crop Focus)</p>
          </div>
          <div>
            <span className="text-[10.5px] uppercase font-bold text-slate-400">Model Rank</span>
            <p className="text-xl font-black text-blue-600 mt-0.5">Voting (0.999 R²)</p>
          </div>
        </div>
      </GlassCard>

      {/* AGRONOMIC RESEARCH CREDENTIALS */}
      <GlassCard padding="md" className="space-y-4">
        <div className="border-b border-emerald-500/10 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" /> Agronomic Research Credentials
          </h3>
          <p className="text-[11px] text-slate-400">
            YieldVision Machine Learning Crop Yield Prediction & Optimization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800 space-y-1">
            <p className="text-[10px] font-bold uppercase text-emerald-600">Active Research Role</p>
            <p className="font-extrabold text-forest-900 dark:text-white text-sm">Lead Agronomist & ML Specialist</p>
            <p className="text-[11px] text-slate-400">Specializing in Sugarcane multi-varietal trial yield models & Pacific ENSO teleconnections.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-forest-950/40 border border-slate-200 dark:border-forest-800 space-y-1">
            <p className="text-[10px] font-bold uppercase text-emerald-600">Decision-Support Authorization</p>
            <p className="font-extrabold text-forest-900 dark:text-white text-sm">Full Administrative & Modeling Access</p>
            <p className="text-[11px] text-slate-400">Authenticated for multi-model ensemble retraining, scenario simulations, and PDF report generation.</p>
          </div>
        </div>
      </GlassCard>

      {/* FAVORITE CROPS & LOCATIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard padding="md" className="space-y-2">
          <div className="flex items-center gap-2 text-forest-900 dark:text-white font-bold text-xs uppercase tracking-wider">
            <Sprout className="w-4 h-4 text-emerald-600" /> Monitored Cultivars
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-forest-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-500/20">
              Co 86032 (Peninsular Elite)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-forest-950 text-blue-800 dark:text-blue-300 font-bold text-xs border border-blue-500/20">
              CoM 0265 (High Biomass)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-forest-950 text-purple-800 dark:text-purple-300 font-bold text-xs border border-purple-500/20">
              Co 0238 (Subtropical Early)
            </span>
          </div>
        </GlassCard>

        <GlassCard padding="md" className="space-y-2">
          <div className="flex items-center gap-2 text-forest-900 dark:text-white font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-600" /> Monitored Regions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Maharashtra', 'Uttar Pradesh', 'Gujarat', 'Punjab', 'Tamil Nadu'].map(loc => (
              <span key={loc} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-forest-950 text-slate-700 dark:text-slate-300 font-semibold text-[11px] border border-slate-200 dark:border-forest-800">
                {loc}
              </span>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
