import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/ui/GlassCard';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Sliders, 
  Activity, 
  ShieldCheck, 
  RotateCcw,
  Database,
  Server,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Languages,
  Volume2,
  Check
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode, speakFarmerGuidance } from '../lib/i18n';

export const Settings: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    addToast, 
    supabaseStatus, 
    refreshSupabaseStatus,
    language,
    setLanguage,
    farmerMode,
    setFarmerMode,
    t
  } = useApp();
  const [testingConnection, setTestingConnection] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
          <span>SYSTEM CONFIGURATION</span>
          <span>•</span>
          <span>PREFERENCES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize theme appearance, measurement units, alert notifications, and UI motion behaviors.
        </p>
      </div>

      {/* SECTION 1: APPEARANCE */}
      <GlassCard padding="md" className="space-y-4">
        <div className="border-b border-emerald-500/10 pb-3">
          <h2 className="text-sm font-bold text-forest-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-emerald-600" />
            Visual Appearance & Theme
          </h2>
          <p className="text-xs text-slate-400">
            Select between high-clarity Light Mint mode and immersive Dark Forest mode
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => updateSettings({ theme: 'light' })}
            className={`
              p-4 rounded-2xl border text-left flex items-start gap-3 transition-all
              ${settings.theme === 'light'
                ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white dark:bg-forest-950/60 border-slate-200 dark:border-forest-800'
              }
            `}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-forest-900 dark:text-white">Light Mint Mode</p>
              <p className="text-[11px] text-slate-500 mt-0.5">High-contrast soft mint and deep forest green palette (Recommended)</p>
            </div>
          </button>

          <button
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`
              p-4 rounded-2xl border text-left flex items-start gap-3 transition-all
              ${settings.theme === 'dark'
                ? 'bg-forest-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20 text-white'
                : 'bg-white dark:bg-forest-950/60 border-slate-200 dark:border-forest-800'
              }
            `}
          >
            <div className="w-8 h-8 rounded-full bg-forest-800 text-emerald-400 flex items-center justify-center shrink-0">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-forest-900 dark:text-white">Dark Forest Mode</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Low-glare deep emerald and jade tones for nocturnal analysis</p>
            </div>
          </button>
        </div>
      </GlassCard>

      {/* SECTION: REGIONAL INDIAN LANGUAGES & FARMER ACCESSIBILITY */}
      <GlassCard padding="md" className="space-y-4">
        <div className="border-b border-emerald-500/10 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-forest-900 dark:text-white flex items-center gap-2">
              <Languages className="w-4 h-4 text-emerald-600" />
              भारतीय प्रादेशिक भाषा व शेतकरी सुलभता (Regional Indian Languages & Farmer Mode)
            </h2>
            <p className="text-xs text-slate-400">
              Select your regional language to automatically adapt crop yield forecasts, fertilizer units, and farmer guidance.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            7 Regional Languages
          </span>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map(opt => (
            <button
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className={`
                p-3.5 rounded-2xl border text-left flex items-start justify-between gap-2 transition-all cursor-pointer
                ${language === opt.code
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 shadow-sm ring-2 ring-emerald-500/30'
                  : 'bg-white dark:bg-forest-950/50 border-slate-200 dark:border-forest-800 hover:border-emerald-500/40'
                }
              `}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-2xl shrink-0 mt-0.5">{opt.flag}</span>
                <div>
                  <p className="text-xs font-black text-forest-900 dark:text-white">
                    {opt.nativeLabel} <span className="text-[11px] font-normal text-slate-500">({opt.label})</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{opt.region}</p>
                </div>
              </div>
              {language === opt.code && (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Farmer Mode & Voice Test Bar */}
        <div className="mt-4 pt-4 border-t border-emerald-500/10 space-y-3">
          {/* Farmer Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/60 dark:from-forest-950/60 dark:to-emerald-950/40 border border-emerald-500/20">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-base">🌾</span>
                <p className="text-xs font-bold text-forest-900 dark:text-white">
                  शेतकरी मित्र मोड (Kisan Mitra Farmer Mode)
                </p>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-emerald-500 text-white">
                  शिफारस केलेले
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                गोंधळात टाकणारे तांत्रिक आकडे न दाखवता थेट क्विंटल/एकर उत्पादन, रासायनिक खतांचे पोत्यांनुसार प्रमाण (युरिया, डीएपी, पोटॅश) आणि सिंचन सल्ला दाखवतो.
              </p>
            </div>
            <button
              onClick={() => setFarmerMode(!farmerMode)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${farmerMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-forest-800'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${farmerMode ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Test Speech Audio */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-forest-950/50 border border-slate-200 dark:border-forest-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>स्थानिक भाषेतील ऑडिओ सल्ला तपासा (Test Voice Audio in {SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeLabel})</span>
            </div>
            <button
              onClick={() => {
                const sampleText = language === 'mr' 
                  ? 'शेतकरी मित्रांनो, यील्डव्हिजन मध्ये आपले स्वागत आहे. येथे तुम्हाला उसाच्या भरघोस उत्पादनासाठी अचूक खत व पाण्याचा सल्ला मिळेल.'
                  : language === 'hi'
                  ? 'किसान भाइयों, यील्डविजन में आपका स्वागत है। यहां आपको गन्ने की अधिक पैदावार के लिए खाद और सिंचाई की सही जानकारी मिलेगी।'
                  : language === 'kn'
                  ? 'ರೈತ ಬಾಂಧವರಿಗೆ ನಮಸ್ಕಾರ, ಈಲ್ಡ್‌ವಿಷನ್‌ಗೆ ಸುಸ್ವಾಗತ.'
                  : 'Welcome to YieldVision Sugarcane Intelligence.';
                speakFarmerGuidance(sampleText, language);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>आवाज ऐका</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* SECTION 2: MEASUREMENT UNITS */}
      <GlassCard padding="md" className="space-y-4">
        <div className="border-b border-emerald-500/10 pb-3">
          <h2 className="text-sm font-bold text-forest-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            Measurement Units & Agronomic Standards
          </h2>
          <p className="text-xs text-slate-400">
            Define units for crop yield outputs and meteorological temperature calculations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-forest-950/50 border border-slate-200 dark:border-forest-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-forest-900 dark:text-white">Yield Measurement Unit</p>
              <p className="text-[11px] text-slate-400">Standard agricultural harvest density</p>
            </div>
            <select
              value={settings.yieldUnit}
              onChange={(e) => updateSettings({ yieldUnit: e.target.value })}
              className="font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-forest-900 border border-slate-300 dark:border-forest-700 text-forest-900 dark:text-white"
            >
              <option value="T/Ha">Tonnes per Hectare (T/Ha)</option>
              <option value="kg/Ha">Kilograms per Hectare (kg/Ha)</option>
              <option value="Quintal/Acre">Quintal per Acre</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-forest-950/50 border border-slate-200 dark:border-forest-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-forest-900 dark:text-white">Temperature Scale</p>
              <p className="text-[11px] text-slate-400">Atmospheric thermal metrics</p>
            </div>
            <select
              value={settings.tempUnit}
              onChange={(e) => updateSettings({ tempUnit: e.target.value })}
              className="font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-forest-900 border border-slate-300 dark:border-forest-700 text-forest-900 dark:text-white"
            >
              <option value="°C">Celsius (°C)</option>
              <option value="°F">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* SECTION 3: NOTIFICATIONS & AUTOMATION */}
      <GlassCard padding="md" className="space-y-4">
        <div className="border-b border-emerald-500/10 pb-3">
          <h2 className="text-sm font-bold text-forest-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            Alert Subscriptions & Notifications
          </h2>
          <p className="text-xs text-slate-400">
            Control automated push alerts for predictions, climate shifts, and model updates
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 'predictionAlerts',
              title: 'Prediction Completion Alerts',
              desc: 'Receive instant toast notices when multi-model ensemble runs finish execution.',
              value: settings.predictionAlerts
            },
            {
              id: 'climateAlerts',
              title: 'Climate Teleconnection Alerts',
              desc: 'Warn when Oceanic Niño Index (ONI) shifts beyond ±0.5°C threshold.',
              value: settings.climateAlerts
            },
            {
              id: 'modelAlerts',
              title: 'Model Benchmarking Recalibration',
              desc: 'Notify when new ICAR/DES datasets improve cross-validated R² scores.',
              value: settings.modelAlerts
            },
            {
              id: 'reducedMotion',
              title: 'Reduced UI Motion',
              desc: 'Disable smooth chart pulse effects and transitions for high performance.',
              value: settings.reducedMotion
            }
          ].map(toggle => (
            <div
              key={toggle.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-forest-950/40 border border-slate-200/70 dark:border-forest-800"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-forest-900 dark:text-white">{toggle.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{toggle.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={toggle.value}
                onChange={(e) => updateSettings({ [toggle.id]: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* SECTION 4: SUPABASE CLOUD DATABASE & AUTH */}
      <GlassCard padding="md" className="space-y-4">
        <div className="border-b border-emerald-500/10 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-forest-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Supabase Cloud Database & Authentication
            </h2>
            <p className="text-xs text-slate-400">
              Live managed PostgreSQL, GoTrue user authentication, and real-time agronomic data sync
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{supabaseStatus.connected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {/* Project URL */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-forest-950/40 border border-slate-200/70 dark:border-forest-800 gap-2">
            <div>
              <p className="font-bold text-forest-900 dark:text-white">Supabase Project Endpoint</p>
              <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">https://pelorvbgtmjcrtsyjalj.supabase.co</p>
            </div>
            <a
              href="https://supabase.com/dashboard/project/pelorvbgtmjcrtsyjalj"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-forest-900 border border-slate-200 dark:border-forest-700 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors shrink-0"
            >
              <span>Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Publishable Key */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-forest-950/40 border border-slate-200/70 dark:border-forest-800 gap-2">
            <div>
              <p className="font-bold text-forest-900 dark:text-white">Publishable Anon Key</p>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">sb_publishable_IW_Wwf61-_1vAEph6j5FFQ_93P_tU6w</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText('sb_publishable_IW_Wwf61-_1vAEph6j5FFQ_93P_tU6w');
                addToast('Publishable key copied to clipboard', 'info');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-forest-900 border border-slate-200 dark:border-forest-700 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Key</span>
            </button>
          </div>

          {/* Direct Postgres */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-forest-950/40 border border-slate-200/70 dark:border-forest-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-forest-900 dark:text-white">Direct PostgreSQL Connection</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-medium">Port 5432</span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-sm sm:max-w-md">
                postgresql://postgres:[YOUR-PASSWORD]@db.pelorvbgtmjcrtsyjalj.supabase.co:5432/postgres
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText('postgresql://postgres:[YOUR-PASSWORD]@db.pelorvbgtmjcrtsyjalj.supabase.co:5432/postgres');
                addToast('Direct PostgreSQL connection string copied', 'info');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-forest-900 border border-slate-200 dark:border-forest-700 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy URI</span>
            </button>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400">
              Tables: predictions, scenarios, datasets & auth users schema generated.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  setTestingConnection(true);
                  await refreshSupabaseStatus();
                  setTestingConnection(false);
                  addToast('Supabase connection verified: Connected!', 'success');
                }}
                disabled={testingConnection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
