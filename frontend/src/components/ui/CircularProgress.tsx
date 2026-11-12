import React from 'react';

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  unit?: string;
  color?: string;
  trackColor?: string;
  labelSize?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 180,
  strokeWidth = 14,
  label,
  sublabel,
  unit = '%',
  color = '#10b981',
  trackColor = 'rgba(16, 185, 129, 0.12)',
  labelSize
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const resolvedLabelSize = labelSize || (size < 130 ? 'text-2xl sm:text-[28px]' : 'text-3xl sm:text-4xl');

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
        <span className={`${resolvedLabelSize} font-black text-forest-900 dark:text-emerald-400 tracking-tight leading-none`}>
          {label ?? `${value}${unit}`}
        </span>
        {sublabel && (
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
