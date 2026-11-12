import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CropType } from '../../types';
import { 
  Menu, 
  Search, 
  Bell, 
  Home,
  MapPin, 
  ChevronDown, 
  Check, 
  Trash2, 
  Sparkles,
  Languages
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode, getLocalizedState } from '../../i18n';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

interface HeaderProps {
  onMenuToggle: () => void;
  onOpenHelp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onOpenHelp }) => {
  const { 
    crop, 
    setCrop, 
    location, 
    setLocation, 
    district,
    setDistrict,
    season, 
    setSeason, 
    setIsSearchOpen,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    clearNotifications,
    addToast,
    setCurrentPage,
    user,
    isAuthenticated,
    logout,
    setIsLoginModalOpen,
    setLoginRedirectPage,
    language,
    setLanguage,
    farmerMode,
    setFarmerMode,
    t
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const locationsList = [
    { state: 'Maharashtra', district: 'Kolhapur' },
    { state: 'Uttar Pradesh', district: 'Muzaffarnagar' },
    { state: 'Karnataka', district: 'Belagavi' },
    { state: 'Tamil Nadu', district: 'Coimbatore' },
    { state: 'Gujarat', district: 'Surat' },
    { state: 'Punjab', district: 'Bathinda' },
    { state: 'Haryana', district: 'Karnal' },
    { state: 'Bihar', district: 'Muzaffarpur' },
    { state: 'Andhra Pradesh', district: 'Visakhapatnam' },
    { state: 'West Bengal', district: 'Nadia' },
    { state: 'Assam', district: 'Golaghat' },
    { state: 'Odisha', district: 'Cuttack' }
  ];

  const seasonsList = ['2025-26', '2024-25', '2023-24', 'Kharif', 'Rabi', 'Whole Year'];

  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as CropType;
    setCrop(val);
    addToast(`Active crop switched to ${val}`, 'info');
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLocation(val);
    const found = locationsList.find(l => l.state === val);
    if (found) setDistrict(found.district);
    addToast(`${getLocalizedState(val, language)} selected`, 'info');
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSeason(val);
    addToast(`Season updated to ${val}`, 'info');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/75 dark:bg-forest-950/85 backdrop-blur-md border-b border-emerald-500/10 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & breadcrumb/status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-forest-900 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Center/Right: Interactive Top Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* 1. Farmer Mode Pill Toggle */}
          <button
            type="button"
            onClick={() => setFarmerMode(!farmerMode)}
            className={`
              inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all shadow-sm cursor-pointer select-none
              ${farmerMode 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/40' 
                : 'bg-slate-100 dark:bg-forest-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-forest-800 hover:border-emerald-500/50'
              }
            `}
            title="Toggle Farmer Guidance Mode (Kisan Mitra)"
          >
            <span className="text-base leading-none">🌾</span>
            <span className="whitespace-nowrap hidden sm:inline">{farmerMode ? t('header.farmer_mode_active') : t('header.farmer_mode')}</span>
            <span className="sm:hidden whitespace-nowrap">{farmerMode ? '🌾' : '⚙️'}</span>
          </button>

          {/* 2. Central Regional Indian Language Switcher Dropdown */}
          <LanguageSwitcher variant="header" align="left" />

          {/* 3. Location Selector Pill with Localized State Names */}
          <div className="relative hidden md:inline-flex items-center shrink-0">
            <select
              value={location}
              onChange={handleLocationChange}
              className="appearance-none bg-emerald-50/80 dark:bg-forest-900/90 text-forest-900 dark:text-emerald-300 border border-emerald-500/25 rounded-full text-xs sm:text-sm font-semibold pl-8 pr-8 h-9 cursor-pointer hover:border-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 whitespace-nowrap leading-none flex items-center"
              aria-label={t('header.select_state')}
            >
              {locationsList.map(loc => (
                <option key={loc.state} value={loc.state}>
                  {getLocalizedState(loc.state, language)} ({loc.district})
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 dark:text-emerald-400" />
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-700 dark:text-emerald-400" />
          </div>

          {/* Season Selector Pill */}
          <div className="relative hidden lg:inline-flex items-center shrink-0">
            <select
              value={season}
              onChange={handleSeasonChange}
              className="appearance-none bg-emerald-50/80 dark:bg-forest-900/90 text-forest-900 dark:text-emerald-300 border border-emerald-500/25 rounded-full text-xs sm:text-sm font-semibold pl-4 pr-8 h-9 cursor-pointer hover:border-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 whitespace-nowrap leading-none flex items-center"
              aria-label="Select season"
            >
              {seasonsList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-700 dark:text-emerald-400" />
          </div>

          {/* Global Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 h-9 rounded-full bg-slate-100/90 dark:bg-forest-900 text-slate-600 dark:text-slate-300 hover:text-forest-900 dark:hover:text-white border border-slate-200/80 dark:border-forest-800 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer"
            aria-label="Search YieldVision"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="hidden xl:inline">Search...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono leading-none bg-white dark:bg-forest-950 rounded border border-slate-300 dark:border-forest-700 text-slate-500">
              Ctrl+K
            </kbd>
          </button>

          {/* Notification Center */}
          <div className="relative inline-flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="relative w-9 h-9 inline-flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-forest-900 transition-colors shrink-0"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-forest-950" />
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-forest-900 shadow-2xl border border-emerald-500/20 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-forest-800">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-forest-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </h3>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {unreadNotificationsCount} new
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Mark read
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-forest-800/60 max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-center py-6 text-slate-400">No new notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`py-2.5 px-1.5 flex gap-2.5 items-start ${n.read ? 'opacity-65' : ''}`}>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{n.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar Menu / Sign In */}
          <div className="relative inline-flex items-center shrink-0">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className="inline-flex items-center justify-center pl-1 cursor-pointer focus:outline-none"
                aria-label="User profile menu"
              >
                <div className="w-9 h-9 rounded-full bg-forest-900 dark:bg-emerald-500 text-white dark:text-forest-950 font-bold text-xs flex items-center justify-center ring-2 ring-emerald-500/20 shadow-sm shrink-0">
                  {user?.avatar || 'KK'}
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setLoginRedirectPage('dashboard');
                  setIsLoginModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full bg-[#073B2A] text-white text-xs sm:text-sm font-semibold hover:bg-[#0B4D38] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Sign In</span>
              </button>
            )}

            {isUserMenuOpen && isAuthenticated && (
              <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-forest-900 shadow-xl border border-emerald-500/20 p-2 z-50 animate-fade-rise">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-forest-800">
                  <p className="text-xs font-bold text-forest-900 dark:text-white">
                    {user?.name || 'Karina Kesur'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || 'karina.kesur@yieldvision.ai'}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {user?.role || 'Agronomist Lead'}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setIsUserMenuOpen(false); setCurrentPage('landing'); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-forest-800 rounded-lg cursor-pointer flex items-center gap-2 font-medium"
                  >
                    <Home className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Return to Home</span>
                  </button>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); setCurrentPage('profile'); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-forest-800 rounded-lg cursor-pointer"
                  >
                    View Agronomist Profile
                  </button>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); setCurrentPage('settings'); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-forest-800 rounded-lg cursor-pointer"
                  >
                    Platform Settings
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-forest-800" />
                  <button
                    onClick={() => { 
                      setIsUserMenuOpen(false); 
                      logout();
                      setCurrentPage('landing');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg font-medium cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
