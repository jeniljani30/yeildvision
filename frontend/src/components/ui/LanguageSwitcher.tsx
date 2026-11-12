import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../i18n';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'header' | 'landing' | 'mobile' | 'settings';
  className?: string;
  align?: 'left' | 'right';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
  align = 'right'
}) => {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
    SUPPORTED_LANGUAGES.find((l) => l.code === 'mr') ||
    SUPPORTED_LANGUAGES[0];

  const listRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top when dropdown opens
  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  // Close dropdown on outside click or Esc key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Button styling variants
  const getButtonStyles = () => {
    switch (variant) {
      case 'landing':
        return 'bg-white/80 hover:bg-white text-[#064E3B] border border-[#064E3B]/20 shadow-sm backdrop-blur-md px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full';
      case 'mobile':
        return 'w-full justify-between bg-emerald-50/80 dark:bg-forest-900 text-forest-900 dark:text-emerald-300 border border-emerald-500/25 px-4 py-2.5 text-sm font-bold rounded-2xl';
      case 'settings':
        return 'bg-white dark:bg-forest-900 border border-emerald-500/30 text-forest-900 dark:text-emerald-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm';
      case 'header':
      default:
        return 'bg-white/90 dark:bg-forest-900/90 text-forest-900 dark:text-emerald-300 border border-emerald-500/25 hover:border-emerald-500 shadow-sm backdrop-blur-md px-3.5 h-9 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap shrink-0 inline-flex items-center';
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-flex items-center shrink-0 ${className}`}>
      {/* Language Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 transition-all cursor-pointer select-none active:scale-[0.98] ${getButtonStyles()}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select regional language"
        title="Change Regional Language / भाषा निवडा / भाषा चुनें"
      >
        <span className="text-base leading-none">🌐</span>
        <span className="font-semibold tracking-tight text-forest-950 dark:text-white">
          {currentOption.nativeLabel}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-600' : ''
          }`}
        />
      </button>

      {/* Language Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Supported Indian Languages"
          className={`
            absolute top-full z-50 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#07241A] 
            border border-emerald-500/30 shadow-[0_12px_40px_rgba(7,59,42,0.18)]
            backdrop-blur-xl p-2 animate-in fade-in zoom-in-95 duration-150
            ${variant === 'mobile' ? 'left-0 w-full' : align === 'left' ? 'left-0' : 'right-0'}
          `}
        >
          {/* Header Description */}
          <div className="px-3.5 py-2.5 border-b border-emerald-500/10 dark:border-emerald-500/20 mb-1">
            <p className="text-xs font-bold text-forest-900 dark:text-white flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Select Language / भाषा निवडा</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              12 Indian Regional Languages Supported
            </p>
          </div>

          {/* Languages List */}
          <div ref={listRef} className="max-h-80 overflow-y-auto py-1 space-y-0.5 scrollbar-thin">
            {SUPPORTED_LANGUAGES.map((opt) => {
              const isSelected = language === opt.code;
              return (
                <button
                  key={opt.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(opt.code)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left 
                    transition-all duration-150 cursor-pointer min-h-[44px]
                    ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-forest-900/80 hover:text-emerald-900 dark:hover:text-emerald-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg shrink-0">{opt.flag}</span>
                    <div>
                      <p
                        className={`text-sm tracking-tight leading-snug ${
                          isSelected ? 'text-white font-bold' : 'text-slate-900 dark:text-slate-100 font-semibold'
                        }`}
                      >
                        {opt.displayText}
                      </p>
                      <p
                        className={`text-[10px] ${
                          isSelected ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-400'
                        }`}
                      >
                        {opt.region}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-white shrink-0" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
