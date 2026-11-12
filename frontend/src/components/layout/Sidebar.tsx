import React from 'react';
import { useApp } from '../../context/AppContext';
import { YieldVisionLogo } from '../ui/YieldVisionLogo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { 
  Home,
  LayoutDashboard, 
  Sprout, 
  Sliders, 
  BarChart3, 
  CloudSun, 
  History, 
  TrendingUp, 
  Settings, 
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { currentPage, setCurrentPage, user, t } = useApp();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'predict', label: t('nav.predict'), icon: Sprout },
    { id: 'simulator', label: t('nav.simulator'), icon: Sliders },
    { id: 'models', label: t('nav.models'), icon: BarChart3 },
    { id: 'climate', label: t('nav.climate'), icon: CloudSun },
    { id: 'history', label: t('nav.history'), icon: History },
    { id: 'analytics', label: t('nav.analytics'), icon: TrendingUp },
  ];

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#063F2F]/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/95 dark:bg-[#07241A] backdrop-blur-xl border-r border-[#064E3B]/10 dark:border-emerald-500/15
        flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Logo & Title (Unified with Landing Page Brand) */}
        <div>
          <div className="flex items-center justify-between px-2 mb-6">
            <button
              onClick={() => handleNavClick('landing')}
              className="text-left group focus:outline-none cursor-pointer"
              title="Return to YieldVision Landing Page"
            >
              <YieldVisionLogo size="md" />
            </button>

            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold
                    transition-all duration-200 group cursor-pointer
                    ${isActive 
                      ? 'bg-[#064E3B] text-white shadow-[0_4px_14px_rgba(6,78,59,0.22)]' 
                      : 'text-slate-700 dark:text-slate-200 hover:bg-[#DDF5EA]/60 dark:hover:bg-[#073B2A] hover:text-[#064E3B] dark:hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-emerald-300' : 'text-slate-500 group-hover:text-[#064E3B]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-80" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Home, Settings & User Profile */}
        <div className="space-y-1 pt-4 border-t border-[#064E3B]/10 dark:border-emerald-500/20">
          <button
            onClick={() => handleNavClick('landing')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#DDF5EA]/60 dark:hover:bg-[#073B2A] hover:text-[#064E3B] dark:hover:text-white transition-all duration-200 cursor-pointer group"
            title="Return to YieldVision Home"
          >
            <Home className="w-[18px] h-[18px] text-slate-500 group-hover:text-[#064E3B] transition-colors" />
            <span>{t('nav.home')}</span>
          </button>

          <button
            onClick={() => handleNavClick('settings')}
            className={`
              w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
              ${currentPage === 'settings' 
                ? 'bg-[#064E3B] text-white shadow-sm' 
                : 'text-slate-700 dark:text-slate-200 hover:bg-[#DDF5EA]/60 dark:hover:bg-[#073B2A] hover:text-[#064E3B] dark:hover:text-white'
              }
            `}
          >
            <Settings className="w-[18px] h-[18px] text-slate-500 group-hover:text-[#064E3B]" />
            <span>{t('nav.settings')}</span>
          </button>

          {/* Mobile Language Switcher */}
          <div className="lg:hidden py-1">
            <LanguageSwitcher variant="mobile" />
          </div>

          {/* Profile Card (Matching Karina Account State) */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`
              w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer
              ${currentPage === 'profile'
                ? 'bg-[#DDF5EA] text-[#064E3B] border border-[#064E3B]/25'
                : 'hover:bg-[#DDF5EA]/40'
              }
            `}
          >
            <div className="w-9 h-9 rounded-full bg-[#064E3B] text-white font-bold text-sm flex items-center justify-center shadow-sm">
              {user?.avatar || 'KK'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#064E3B] dark:text-white truncate">
                {user?.name || 'Karina Kesur'}
              </p>
              <p className="text-xs text-[#52635B] dark:text-slate-300 truncate">
                {user?.role || 'Lead Agronomist • AI Lab'}
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
