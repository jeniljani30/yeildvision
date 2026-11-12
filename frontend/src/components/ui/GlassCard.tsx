import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  id?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'md',
  id,
  onClick
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        glass-panel
        ${paddingClasses[padding]}
        ${hoverEffect ? 'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glass-hover hover:border-emerald-500/30' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
