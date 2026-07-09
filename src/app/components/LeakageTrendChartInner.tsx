'use client';
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

const data = [
  { date: 'Jun 9',  pricing: 1200, discount: 980,  returns: 2100, shrinkage: 2800, employee: 720,  supplier: 1100 },
  { date: 'Jun 12', pricing: 1850, discount: 1200, returns: 1900, shrinkage: 2400, employee: 810,  supplier: 1350 },
  { date: 'Jun 15', pricing: 1100, discount: 1450, returns: 2400, shrinkage: 3100, employee: 680,  supplier: 1200 },
  { date: 'Jun 18', pricing: 2300, discount: 1100, returns: 2200, shrinkage: 2700, employee: 920,  supplier: 1480 },
  { date: 'Jun 21', pricing: 1700, discount: 1800, returns: 1800, shrinkage: 2900, employee: 750,  supplier: 1310 },
  { date: 'Jun 24', pricing: 2100, discount: 2200, returns: 2600, shrinkage: 3400, employee: 1100, supplier: 1600 },
  { date: 'Jun 27', pricing: 1400, discount: 1600, returns: 2100, shrinkage: 2600, employee: 830,  supplier: 1250 },
  { date: 'Jun 30', pricing: 1900, discount: 1300, returns: 2800, shrinkage: 3200, employee: 960,  supplier: 1420 },
  { date: 'Jul 3',  pricing: 2400, discount: 2100, returns: 3100, shrinkage: 3700, employee: 1200, supplier: 1700 },
  { date: 'Jul 6',  pricing: 2100, discount: 1900, returns: 2900, shrinkage: 3500, employee: 1050, supplier: 1580 },
  { date: 'Jul 9',  pricing: 2800, discount: 2300, returns: 3400, shrinkage: 4100, employee: 1300, supplier: 1890 },
];

const categories = [
  { key: 'shrinkage', color: '#e84545', label: 'Shrinkage' },
  { key: 'returns',   color: '#fb923c', label: 'Returns' },
  { key: 'pricing',   color: '#f59e0b', label: 'Pricing Errors' },
  { key: 'discount',  color: '#3b82f6', label: 'Discount Abuse' },
  { key: 'supplier',  color: '#8b5cf6', label: 'Supplier Risk' },
  { key: 'employee',  color: '#22c55e', label: 'Employee Anomalies' },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0);
  return (
    <div className="bg-card border border-border rounded-lg shadow-elevated p-3 min-w-[200px]">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={`tooltip-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-muted-foreground">{entry.name}</span>
          </div>
          <span className="text-xs font-medium text-foreground tabular-nums">${entry.value.toLocaleString()}</span>
        </div>
      ))}
      <div className="border-t border-border mt-2 pt-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">Total</span>
        <span className="text-xs font-bold text-primary tabular-nums">${total.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function LeakageTrendChartInner() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Leaked Revenue by Category</h2>
          <p className="text-xs text-muted-foreground mt-0.5">30-day trend across all risk categories</p>
        </div>
        <span className="text-xs text-muted-foreground font-mono">Jun 9 – Jul 9</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {categories.map((cat) => (
              <linearGradient key={`grad-${cat.key}`} id={`grad-${cat.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cat.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={cat.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', color: 'var(--muted-foreground)', paddingTop: '12px' }}
          />
          {categories.map((cat) => (
            <Area
              key={`area-${cat.key}`}
              type="monotone"
              dataKey={cat.key}
              name={cat.label}
              stroke={cat.color}
              fill={`url(#grad-${cat.key})`}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: cat.color, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}