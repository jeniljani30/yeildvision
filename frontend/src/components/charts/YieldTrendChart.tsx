import React, { useState } from 'react';

interface YieldTrendPoint {
  year: number;
  actual: number | null;
  predicted: number;
  climate?: string;
}

interface YieldTrendChartProps {
  data: YieldTrendPoint[];
  unit?: string;
}

export const YieldTrendChart: React.FC<YieldTrendChartProps> = ({ data, unit = 'T/Ha' }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 640;
  const height = 260;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Compute min/max for scale
  const allValues = data.flatMap(d => [d.actual, d.predicted].filter((v): v is number => v !== null));
  const minVal = Math.floor(Math.min(...allValues) * 0.9);
  const maxVal = Math.ceil(Math.max(...allValues) * 1.1);

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight;

  // Actual points line
  const actualPoints = data
    .map((d, i) => d.actual !== null ? `${getX(i)},${getY(d.actual)}` : null)
    .filter((pt): pt is string => pt !== null);

  // Predicted points line
  const predictedPoints = data.map((d, i) => `${getX(i)},${getY(d.predicted)}`).join(' ');

  // Y-axis grid ticks
  const yTicks = [minVal, (minVal + maxVal) / 2, maxVal].map(v => Number(v.toFixed(1)));

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Axis Gridlines */}
        {yTicks.map((tick, i) => {
          const yPos = getY(tick);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={yPos}
                x2={width - padding.right}
                y2={yPos}
                stroke="currentColor"
                className="text-slate-200 dark:text-forest-800"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={yPos + 4}
                textAnchor="end"
                className="text-[10px] font-semibold fill-slate-400 dark:fill-slate-500"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Predicted Area Fill */}
        <polygon
          points={`
            ${getX(0)},${padding.top + plotHeight}
            ${predictedPoints}
            ${getX(data.length - 1)},${padding.top + plotHeight}
          `}
          fill="url(#predictedGradient)"
        />

        {/* Predicted Line */}
        <polyline
          points={predictedPoints}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Actual Line (if points exist) */}
        {actualPoints.length > 1 && (
          <polyline
            points={actualPoints.join(' ')}
            fill="none"
            stroke="#0f2e22"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="dark:stroke-slate-300"
          />
        )}

        {/* Data Points */}
        {data.map((d, i) => {
          const x = getX(i);
          const yPred = getY(d.predicted);
          const isHovered = hoveredIdx === i;

          return (
            <g key={i} className="cursor-pointer">
              {/* Actual dot */}
              {d.actual !== null && (
                <circle
                  cx={x}
                  cy={getY(d.actual)}
                  r={isHovered ? 5 : 3.5}
                  fill="#0f2e22"
                  className="dark:fill-slate-200 transition-all duration-200"
                />
              )}

              {/* Predicted dot */}
              <circle
                cx={x}
                cy={yPred}
                r={isHovered ? 6 : 4.5}
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2.5"
                className="transition-all duration-200"
              />

              {/* X Axis Label */}
              <text
                x={x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                className={`text-[10px] font-bold ${isHovered ? 'fill-emerald-600 font-extrabold' : 'fill-slate-500 dark:fill-slate-400'}`}
              >
                {d.year}
              </text>

              {/* Invisible touch/hover zone */}
              <rect
                x={x - 20}
                y={padding.top}
                width={40}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute z-20 pointer-events-none p-2 rounded-xl bg-forest-900 text-white text-xs shadow-xl border border-emerald-500/20 transform -translate-x-1/2 -translate-y-full mb-2"
          style={{
            left: `${(getX(hoveredIdx) / width) * 100}%`,
            top: `${(getY(data[hoveredIdx].predicted) / height) * 100}%`
          }}
        >
          <div className="font-bold border-b border-emerald-500/30 pb-1 mb-1 flex items-center justify-between gap-3">
            <span>Year {data[hoveredIdx].year}</span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {data[hoveredIdx].climate || 'Active'}
            </span>
          </div>
          <div className="space-y-0.5 text-[11px]">
            <p className="flex justify-between gap-4">
              <span className="text-emerald-300">Predicted:</span>
              <span className="font-bold">{data[hoveredIdx].predicted} {unit}</span>
            </p>
            {data[hoveredIdx].actual !== null && (
              <p className="flex justify-between gap-4 text-slate-300">
                <span>Actual:</span>
                <span className="font-bold">{data[hoveredIdx].actual} {unit}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-emerald-500 rounded" />
          <span>Predicted Yield (Ensemble)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 border-b-2 border-dashed border-forest-900 dark:border-slate-300" />
          <span>Actual Historical Yield</span>
        </div>
      </div>
    </div>
  );
};
