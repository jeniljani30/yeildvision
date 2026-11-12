import React from 'react';
import { FeatureImportanceItem } from '../../types';

interface FeatureImportanceChartProps {
  data: FeatureImportanceItem[];
  maxItems?: number;
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({
  data,
  maxItems = 9
}) => {
  if (!data || data.length === 0) return null;

  const items = data.slice(0, maxItems);
  const maxImportance = Math.max(...items.map(d => d.importance), 0.35);

  const categoryColors: Record<string, { bg: string; fill: string; border: string }> = {
    Weather: { bg: 'bg-blue-50 dark:bg-blue-950/40', fill: 'bg-blue-500', border: 'border-blue-200' },
    Soil: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', fill: 'bg-emerald-500', border: 'border-emerald-200' },
    Nutrient: { bg: 'bg-amber-50 dark:bg-amber-950/40', fill: 'bg-amber-500', border: 'border-amber-200' },
    Climate: { bg: 'bg-purple-50 dark:bg-purple-950/40', fill: 'bg-purple-500', border: 'border-purple-200' },
    Historical: { bg: 'bg-slate-50 dark:bg-slate-800/40', fill: 'bg-forest-900 dark:bg-slate-300', border: 'border-slate-200' }
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const percent = ((item.importance / maxImportance) * 100);
        const actualPct = (item.importance * 100).toFixed(1);
        const color = categoryColors[item.category] || categoryColors.Weather;

        return (
          <div key={item.feature} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9.5px] font-bold ${index < 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-forest-800 text-slate-600'}`}>
                  {index + 1}
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {item.feature}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 dark:bg-forest-800 text-slate-500">
                  {item.category}
                </span>
              </div>
              <span className="font-mono font-bold text-forest-900 dark:text-emerald-400">
                {actualPct}%
              </span>
            </div>

            {/* Horizontal Bar */}
            <div className="h-2.5 w-full bg-slate-100 dark:bg-forest-950 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-forest-800">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${color.fill}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
