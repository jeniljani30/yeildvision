import React from 'react';

interface MetricPillProps {
  label: string;
  variant?: 'emerald' | 'forest' | 'blue' | 'amber' | 'red' | 'gray';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const MetricPill: React.FC<MetricPillProps> = ({
  label,
  variant = 'emerald',
  size = 'md',
  icon,
  className = ''
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
    forest: 'bg-forest-900 text-white border-forest-800 dark:bg-emerald-500 dark:text-forest-950',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
    red: 'bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50',
    gray: 'bg-slate-100 text-slate-700 border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium gap-1',
    md: 'text-sm px-3.5 py-1.5 font-semibold gap-1.5'
  };

  return (
    <span className={`inline-flex items-center rounded-full border shadow-sm transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
