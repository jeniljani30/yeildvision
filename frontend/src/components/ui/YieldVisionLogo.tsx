import React from 'react';

interface YieldVisionLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  isDark?: boolean;
}

export const YieldVisionLogo: React.FC<YieldVisionLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  isDark = false,
}) => {
  // Enhanced, bolder typography sizes
  const titleSizes = {
    sm: 'text-2xl sm:text-3xl',
    md: 'text-3xl sm:text-[34px] lg:text-[36px]',
    lg: 'text-4xl sm:text-5xl lg:text-[56px]',
  }[size];

  const subtitleSizes = {
    sm: 'text-[11px] sm:text-xs tracking-[0.24em]',
    md: 'text-xs sm:text-[13px] tracking-[0.24em]',
    lg: 'text-xs sm:text-[14px] tracking-[0.28em]',
  }[size];

  return (
    <div className={`flex flex-col justify-center text-left select-none ${className}`}>
      {/* Pure Typographic Wordmark - Logo graphics removed everywhere as requested */}
      <span
        className={`font-serif ${titleSizes} tracking-tight font-medium leading-none ${
          isDark ? 'text-white' : 'text-[#064E3B] dark:text-white'
        }`}
      >
        YieldVision
      </span>

      {showSubtitle && (
        <span
          className={`font-sans font-bold uppercase ${subtitleSizes} mt-1.5 leading-none ${
            isDark ? 'text-emerald-300' : 'text-[#064E3B] dark:text-emerald-400'
          }`}
        >
          AI AGRICULTURAL INTELLIGENCE
        </span>
      )}
    </div>
  );
};
