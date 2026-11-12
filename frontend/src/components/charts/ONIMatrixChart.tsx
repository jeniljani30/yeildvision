import React, { useState } from 'react';
import { ONIRecord } from '../../types';

interface ONIMatrixChartProps {
  data: ONIRecord[];
  crop?: string;
}

export const ONIMatrixChart: React.FC<ONIMatrixChartProps> = ({ data, crop = 'Sugarcane' }) => {
  const [hoveredRecord, setHoveredRecord] = useState<ONIRecord | null>(null);

  if (!data || data.length === 0) return null;

  const width = 760;
  const height = 280;
  const padding = { top: 35, right: 30, bottom: 45, left: 45 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const minONI = -2.5;
  const maxONI = 2.5;

  const getX = (idx: number) => padding.left + (idx / Math.max(1, data.length - 1)) * plotW;
  const getY = (val: number) => padding.top + plotH - ((val - minONI) / (maxONI - minONI)) * plotH;
  const zeroY = getY(0);

  // Threshold lines for +0.5 and -0.5
  const elNinoY = getY(0.5);
  const laNinaY = getY(-0.5);

  const getBarColor = (val: number) => {
    if (val >= 1.5) return '#ef4444'; // Strong El Niño
    if (val >= 0.5) return '#f87171'; // Moderate El Niño
    if (val <= -1.5) return '#2563eb'; // Strong La Niña
    if (val <= -0.5) return '#60a5fa'; // Moderate La Niña
    return '#94a3b8'; // Neutral
  };

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Background Phase Bands */}
        {/* El Niño Zone (>= 0.5) */}
        <rect
          x={padding.left}
          y={padding.top}
          width={plotW}
          height={elNinoY - padding.top}
          fill="rgba(239, 68, 68, 0.05)"
        />
        {/* Neutral Zone (-0.5 to 0.5) */}
        <rect
          x={padding.left}
          y={elNinoY}
          width={plotW}
          height={laNinaY - elNinoY}
          fill="rgba(16, 185, 129, 0.03)"
        />
        {/* La Niña Zone (<= -0.5) */}
        <rect
          x={padding.left}
          y={laNinaY}
          width={plotW}
          height={padding.top + plotH - laNinaY}
          fill="rgba(37, 99, 235, 0.05)"
        />

        {/* Reference Threshold Lines */}
        <line
          x1={padding.left}
          y1={elNinoY}
          x2={width - padding.right}
          y2={elNinoY}
          stroke="#f87171"
          strokeDasharray="4 4"
          strokeWidth="1"
        />
        <text
          x={width - padding.right}
          y={elNinoY - 4}
          textAnchor="end"
          className="text-[9px] font-bold fill-red-500 uppercase tracking-wider"
        >
          El Niño (+0.5°C)
        </text>

        {/* Zero Neutral Line */}
        <line
          x1={padding.left}
          y1={zeroY}
          x2={width - padding.right}
          y2={zeroY}
          stroke="#0f2e22"
          strokeWidth="1.5"
          className="dark:stroke-emerald-400"
        />

        <line
          x1={padding.left}
          y1={laNinaY}
          x2={width - padding.right}
          y2={laNinaY}
          stroke="#60a5fa"
          strokeDasharray="4 4"
          strokeWidth="1"
        />
        <text
          x={width - padding.right}
          y={laNinaY + 12}
          textAnchor="end"
          className="text-[9px] font-bold fill-blue-500 uppercase tracking-wider"
        >
          La Niña (-0.5°C)
        </text>

        {/* ONI Bars */}
        {data.map((r, i) => {
          const x = getX(i);
          const y = getY(r.oni_value);
          const barHeight = Math.abs(y - zeroY);
          const barY = r.oni_value >= 0 ? y : zeroY;
          const barColor = getBarColor(r.oni_value);
          const isSelected = hoveredRecord?.date === r.date;

          return (
            <g key={i} className="cursor-pointer">
              <rect
                x={x - 4}
                y={barY}
                width={8}
                height={Math.max(2, barHeight)}
                rx={2}
                fill={barColor}
                opacity={isSelected ? 1 : 0.85}
                className="transition-all duration-200 hover:opacity-100"
              />

              {/* Invisible hover trigger */}
              <rect
                x={x - 10}
                y={padding.top}
                width={20}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHoveredRecord(r)}
                onMouseLeave={() => setHoveredRecord(null)}
              />
            </g>
          );
        })}

        {/* X Axis Year Labels (sparse) */}
        {data.filter((_, idx) => idx % Math.ceil(data.length / 8) === 0).map((r, i) => {
          const x = getX(data.indexOf(r));
          return (
            <text
              key={i}
              x={x}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="text-[9.5px] font-bold fill-slate-500"
            >
              {r.year}
            </text>
          );
        })}

        {/* Y Axis ticks */}
        {[-2.0, -1.0, 0, 1.0, 2.0].map((tick) => {
          const yPos = getY(tick);
          return (
            <text
              key={tick}
              x={padding.left - 8}
              y={yPos + 3}
              textAnchor="end"
              className="text-[9px] font-semibold fill-slate-400"
            >
              {tick > 0 ? `+${tick}` : tick}°
            </text>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredRecord && (
        <div
          className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-forest-900 text-white text-xs shadow-2xl border border-emerald-500/20 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${(getX(data.indexOf(hoveredRecord)) / width) * 100}%`,
            top: `${(getY(hoveredRecord.oni_value) / height) * 100}%`
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-emerald-500/30 pb-1 mb-1">
            <span className="font-bold">{hoveredRecord.date}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              hoveredRecord.phase === 'El Niño' ? 'bg-red-500/30 text-red-300' :
              hoveredRecord.phase === 'La Niña' ? 'bg-blue-500/30 text-blue-300' :
              'bg-emerald-500/30 text-emerald-300'
            }`}>
              {hoveredRecord.phase}
            </span>
          </div>
          <div className="space-y-0.5 text-[11px]">
            <p className="flex justify-between gap-4">
              <span className="text-slate-300">Niño 3.4 SST:</span>
              <span className="font-bold font-mono">{hoveredRecord.oni_value > 0 ? '+' : ''}{hoveredRecord.oni_value}°C</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-300">Rainfall Anom:</span>
              <span className="font-bold font-mono">{hoveredRecord.rainfall_anomaly_pct > 0 ? '+' : ''}{hoveredRecord.rainfall_anomaly_pct}%</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-emerald-300">Sugarcane Yield:</span>
              <span className="font-bold">{hoveredRecord.sugarcane_yield} T/Ha</span>
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>El Niño (Drought Risk)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span>Neutral (Stable Normal)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>La Niña (Moisture Surplus)</span>
        </div>
      </div>
    </div>
  );
};
