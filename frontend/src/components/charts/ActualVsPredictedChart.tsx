import React, { useState } from 'react';

interface Point {
  actual: number;
  predicted: number;
  label?: string;
}

interface ActualVsPredictedChartProps {
  data?: Point[];
  crop?: string;
  unit?: string;
}

export const ActualVsPredictedChart: React.FC<ActualVsPredictedChartProps> = ({
  data,
  crop = 'Sugarcane',
  unit = 'T/Ha'
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);

  // Default points if none provided
  const points: Point[] = data && data.length > 0 ? data : [
    { actual: 6.9, predicted: 6.85, label: '2020-R' },
    { actual: 7.1, predicted: 7.14, label: '2021-K' },
    { actual: 7.25, predicted: 7.30, label: '2021-R' },
    { actual: 6.75, predicted: 6.68, label: '2022-K' },
    { actual: 7.45, predicted: 7.42, label: '2022-R' },
    { actual: 6.40, predicted: 6.50, label: '2023-K (El Niño)' },
    { actual: 7.15, predicted: 7.12, label: '2023-R' },
    { actual: 7.35, predicted: 7.38, label: '2024-K' },
    { actual: 7.60, predicted: 7.55, label: '2024-R' },
    { actual: 7.80, predicted: 7.82, label: '2025-Active' }
  ];

  const width = 500;
  const height = 280;
  const padding = { top: 25, right: 25, bottom: 45, left: 45 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const minVal = 6.0;
  const maxVal = 8.5;

  const scale = (val: number) => ((val - minVal) / (maxVal - minVal));
  const getX = (actual: number) => padding.left + scale(actual) * plotW;
  const getY = (pred: number) => padding.top + plotH - scale(pred) * plotH;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Ideal parity line: actual === predicted (45 degree) */}
        <line
          x1={getX(minVal)}
          y1={getY(minVal)}
          x2={getX(maxVal)}
          y2={getY(maxVal)}
          stroke="#10b981"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-70"
        />

        {/* X and Y Axes */}
        <line
          x1={padding.left}
          y1={padding.top + plotH}
          x2={width - padding.right}
          y2={padding.top + plotH}
          stroke="currentColor"
          className="text-slate-300 dark:text-forest-800"
          strokeWidth="1"
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + plotH}
          stroke="currentColor"
          className="text-slate-300 dark:text-forest-800"
          strokeWidth="1"
        />

        {/* Ticks */}
        {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5].map((tick) => {
          const xPos = getX(tick);
          const yPos = getY(tick);
          return (
            <g key={tick}>
              <text
                x={xPos}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className="text-[9.5px] font-semibold fill-slate-400"
              >
                {tick}
              </text>
              <text
                x={padding.left - 8}
                y={yPos + 3}
                textAnchor="end"
                className="text-[9.5px] font-semibold fill-slate-400"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Data points */}
        {points.map((pt, i) => {
          const cx = getX(pt.actual);
          const cy = getY(pt.predicted);
          const isSelected = hoveredPoint?.label === pt.label;

          return (
            <g key={i} className="cursor-pointer">
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 7 : 5}
                fill={isSelected ? '#10b981' : '#0f2e22'}
                stroke="#ffffff"
                strokeWidth="2"
                className="dark:fill-emerald-400 dark:stroke-forest-900 transition-all duration-200"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          );
        })}

        {/* Axis Labels */}
        <text
          x={width / 2}
          y={height - 8}
          textAnchor="middle"
          className="text-[10px] font-bold fill-slate-500 uppercase tracking-wider"
        >
          Observed Ground-Truth Yield ({unit})
        </text>
        <text
          x={12}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90 12 ${height / 2})`}
          className="text-[10px] font-bold fill-slate-500 uppercase tracking-wider"
        >
          Voting Regressor Output ({unit})
        </text>
      </svg>

      {/* Floating Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none p-2 rounded-xl bg-forest-900 text-white text-xs shadow-xl border border-emerald-500/20 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${(getX(hoveredPoint.actual) / width) * 100}%`,
            top: `${(getY(hoveredPoint.predicted) / height) * 100}%`
          }}
        >
          <p className="font-bold text-emerald-400 text-[10px] uppercase">{hoveredPoint.label}</p>
          <p className="text-[11px] font-medium">Actual: {hoveredPoint.actual} {unit}</p>
          <p className="text-[11px] font-medium">Predicted: {hoveredPoint.predicted} {unit}</p>
          <p className="text-[10px] text-slate-300">
            Residual: {(hoveredPoint.actual - hoveredPoint.predicted).toFixed(3)}
          </p>
        </div>
      )}
    </div>
  );
};
