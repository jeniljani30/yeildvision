import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, LayoutDashboard, Sparkles, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface LandingNavbarProps {
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onExploreIntelligence?: () => void;
  onHomeClick?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenAbout,
  onOpenContact,
  onExploreIntelligence,
  onHomeClick,
}) => {
  const { 
    isAuthenticated,
    user,
    logout,
    setIsLoginModalOpen, 
    setLoginRedirectPage,
    setCurrentPage,
    addToast
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProtectedNav = (targetPage: string, pageLabel: string) => {
    setIsMobileMenuOpen(false);
    if (isAuthenticated) {
      setCurrentPage(targetPage);
    } else {
      setLoginRedirectPage(targetPage);
      setIsLoginModalOpen(true);
      addToast(`Administrator login required to access ${pageLabel}`, 'warning');
    }
  };

  const handleHomeClick = () => {
    setIsMobileMenuOpen(false);
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSignInClick = () => {
    setLoginRedirectPage('dashboard');
    setIsLoginModalOpen(true);
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Karina';

  return (
    <header
      className="absolute top-0 left-0 right-0 z-40 py-5 sm:py-6 px-6 sm:px-10 lg:px-16"
      role="banner"
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* 1. Left: Typographic Wordmark & Subtitle in Single Horizontal Line */}
        <button
          onClick={handleHomeClick}
          className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer select-none"
          aria-label="YieldVision Home"
        >
          <span className="font-serif text-2xl sm:text-[28px] tracking-[0.05em] text-[#064E3B] font-medium leading-none">
            YIELDVISION
          </span>
          <span className="hidden sm:inline-block font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#064E3B]/80 leading-none">
            AI AGRICULTURAL INTELLIGENCE
          </span>
        </button>

        {/* 2. Center: Rounded Pill Nav Matching Image 1 */}
        <nav 
          className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-sm"
          aria-label="Main Navigation"
        >
          <button
            onClick={handleHomeClick}
            className="px-5 py-2 rounded-full bg-[#064E3B] text-white font-sans text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleProtectedNav('climate', 'Climate Intelligence')}
            className="px-4 py-2 rounded-full text-[#10231D] hover:text-[#064E3B] hover:bg-white/60 font-sans text-sm font-medium transition-all cursor-pointer"
          >
            Intelligence
          </button>
          <button
            onClick={() => handleProtectedNav('predict', 'Yield Predictor')}
            className="px-4 py-2 rounded-full text-[#10231D] hover:text-[#064E3B] hover:bg-white/60 font-sans text-sm font-medium transition-all cursor-pointer"
          >
            Prediction
          </button>
          <button
            onClick={() => handleProtectedNav('models', 'Model Performance')}
            className="px-4 py-2 rounded-full text-[#10231D] hover:text-[#064E3B] hover:bg-white/60 font-sans text-sm font-medium transition-all cursor-pointer"
          >
            Models
          </button>
          <button
            onClick={() => handleProtectedNav('simulator', 'What-If Simulator')}
            className="px-4 py-2 rounded-full text-[#10231D] hover:text-[#064E3B] hover:bg-white/60 font-sans text-sm font-medium transition-all cursor-pointer"
          >
            What-If
          </button>
        </nav>

        {/* 3. Right: Sign In / Login */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Primary Top-Right Button: Sign In / Login */}
          {isAuthenticated ? (
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] hover:bg-[#063F2F] text-white px-5 sm:px-6 py-2.5 text-sm font-sans font-semibold transition-all duration-200 hover:scale-[1.02] shadow-[0_4px_14px_rgba(6,78,59,0.22)] cursor-pointer whitespace-nowrap shrink-0"
                title={`${user?.name || 'Karina Kesur'} (Signed In)`}
              >
                <span>{displayName}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white/95 backdrop-blur-xl shadow-[0_15px_40px_rgba(6,78,59,0.14)] border border-slate-200/80 p-2 z-50 animate-fade-rise">
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-[#064E3B]">
                      {user?.name || 'Karina Kesur'}
                    </p>
                    <p className="text-[11px] text-[#65756E] truncate mt-0.5">
                      {user?.email || 'karina.kesur@yieldvision.ai'}
                    </p>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setCurrentPage('dashboard');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#DDF5EA]/60 hover:text-[#064E3B] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#064E3B]" />
                      <span>Overview Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setCurrentPage('predict');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#DDF5EA]/60 hover:text-[#064E3B] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Yield Predictor</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleSignInClick}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] hover:bg-[#063F2F] text-white px-5 sm:px-6 py-2.5 text-sm font-sans font-semibold transition-all duration-200 hover:scale-[1.02] shadow-[0_4px_14px_rgba(6,78,59,0.22)] cursor-pointer whitespace-nowrap shrink-0"
              title="Sign In / Log In to YieldVision"
            >
              <LogIn className="w-4 h-4 text-emerald-300" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/80 text-[#064E3B] border border-white/60 shadow-sm"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl space-y-2 animate-in fade-in">
          <button
            onClick={handleHomeClick}
            className="w-full text-left px-4 py-2.5 rounded-xl bg-[#064E3B] text-white text-sm font-semibold"
          >
            Home
          </button>
          <button
            onClick={() => handleProtectedNav('climate', 'Climate Intelligence')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 text-sm font-medium"
          >
            Intelligence
          </button>
          <button
            onClick={() => handleProtectedNav('predict', 'Yield Predictor')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 text-sm font-medium"
          >
            Prediction
          </button>
          <button
            onClick={() => handleProtectedNav('models', 'Model Performance')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 text-sm font-medium"
          >
            Models
          </button>
          <button
            onClick={() => handleProtectedNav('simulator', 'What-If Simulator')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 text-sm font-medium"
          >
            What-If
          </button>
          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-50 text-rose-700 py-2.5 text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({displayName})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignInClick();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] text-white py-2.5 text-sm font-semibold"
              >
                <LogIn className="w-4 h-4 text-emerald-300" />
                <span>Sign In / Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
