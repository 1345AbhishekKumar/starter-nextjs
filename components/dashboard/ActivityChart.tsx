'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface DataPoint {
  day: string;
  value: number;
}

const mockData: DataPoint[] = [
  { day: 'Mon', value: 2 },
  { day: 'Tue', value: 5 },
  { day: 'Wed', value: 3 },
  { day: 'Thu', value: 8 },
  { day: 'Fri', value: 4 },
  { day: 'Sat', value: 9 },
  { day: 'Sun', value: 6 },
];

export function ActivityChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Dimensions
  const width = 500;
  const height = 200;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Max value in mock data
  const maxValue = 10;

  // Helper to map data point to SVG coordinates
  const getCoordinates = (index: number, value: number) => {
    const x = paddingX + (index / (mockData.length - 1)) * chartWidth;
    const y = height - paddingY - (value / maxValue) * chartHeight;
    return { x, y };
  };

  // Generate path string for the line
  let linePath = '';
  let areaPath = '';

  const points = mockData.map((d, i) => getCoordinates(i, d.value));

  if (points.length > 0) {
    // Standard line path
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Create a smooth cubic bezier connection
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }

    // Area path for gradient fill
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  }

  return (
    <div className='bento-cell flex h-full min-h-[300px] flex-col justify-between p-6'>
      <div>
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-mono-custom text-[10px] tracking-widest text-[#525252]/60 uppercase'>
              Activity Trends
            </p>
            <h3 className='mt-1 text-base font-semibold text-[#111111]'>
              Creation Index
            </h3>
          </div>
          <div className='font-mono-custom flex items-center gap-1.5 rounded-full bg-[#6e9c4e]/10 px-3 py-1 text-[10px] tracking-wider text-[#6e9c4e] uppercase'>
            <span>+15% vs last week</span>
            <ArrowUpRight size={12} />
          </div>
        </div>
        <p className='font-mono-custom mt-2 text-xs leading-relaxed text-[#525252]/80'>
          Measuring your creative output (drafts, entries, and edits) over the
          past 7 days.
        </p>
      </div>

      {/* SVG Chart */}
      <div className='relative my-6 flex w-full flex-1 items-center justify-center'>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className='h-auto w-full overflow-visible select-none'
        >
          <defs>
            {/* Smooth Sage Green Gradient */}
            <linearGradient id='chartGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#6e9c4e' stopOpacity='0.25' />
              <stop offset='100%' stopColor='#6e9c4e' stopOpacity='0.0' />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 2, 4, 6, 8, 10].map((val) => {
            const y = height - paddingY - (val / maxValue) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke='#111111'
                  strokeOpacity='0.05'
                  strokeWidth='1'
                  strokeDasharray='4 4'
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor='end'
                  className='font-mono-custom fill-[#525252]/50 text-[9px]'
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          {areaPath && <path d={areaPath} fill='url(#chartGradient)' />}

          {/* Sparkline Line */}
          {linePath && (
            <path
              d={linePath}
              fill='none'
              stroke='#6e9c4e'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          )}

          {/* X Axis line */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke='#111111'
            strokeOpacity='0.08'
            strokeWidth='1'
          />

          {/* Data nodes */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                {/* Invisible hover trigger */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r='14'
                  fill='transparent'
                  className='cursor-pointer'
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 8 : 4}
                  fill={isHovered ? '#6e9c4e' : 'transparent'}
                  fillOpacity='0.15'
                  className='pointer-events-none transition-all duration-200'
                />

                {/* Inner dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 4.5 : 3}
                  fill={isHovered ? '#6e9c4e' : '#f9f8f6'}
                  stroke='#6e9c4e'
                  strokeWidth={isHovered ? 1.5 : 2}
                  className='pointer-events-none transition-all duration-200'
                />

                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={height - paddingY + 16}
                  textAnchor='middle'
                  className={`font-mono-custom text-[9px] tracking-wider uppercase ${
                    isHovered
                      ? 'fill-[#111111] font-semibold'
                      : 'fill-[#525252]/60'
                  } transition-colors duration-200`}
                >
                  {mockData[i].day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Info / Value display */}
      <div className='flex items-center justify-between border-t border-[#111111]/5 pt-3'>
        <span className='font-mono-custom text-[9px] tracking-wider text-[#525252]/60 uppercase'>
          {hoveredIndex !== null ? 'Selected Value' : 'Weekly Average'}
        </span>
        <span className='font-mono-custom text-xs font-semibold text-[#111111]'>
          {hoveredIndex !== null
            ? `${mockData[hoveredIndex].value} creations on ${mockData[hoveredIndex].day}`
            : '5.4 creations / day'}
        </span>
      </div>
    </div>
  );
}
