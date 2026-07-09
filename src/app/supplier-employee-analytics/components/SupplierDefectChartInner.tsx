'use client';
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Aug 25', apex: 4.1, nordic: 3.2, shenzhen: 4.8, medina: 2.9, porto: 2.8 },
  { month: 'Sep 25', apex: 4.4, nordic: 3.0, shenzhen: 4.6, medina: 3.1, porto: 2.6 },
  { month: 'Oct 25', apex: 4.8, nordic: 3.4, shenzhen: 5.1, medina: 2.8, porto: 2.5 },
  { month: 'Nov 25', apex: 5.2, nordic: 3.1, shenzhen: 5.4, medina: 3.0, porto: 2.4 },
  { month: 'Dec 25', apex: 5.9, nordic: 3.8, shenzhen: 5.9, medina: 3.3, porto: 2.3 },
  { month: 'Jan 26', apex: 6.1, nordic: 3.6, shenzhen: 6.1, medina: 3.1, porto: 2.2 },
  { month: 'Feb 26', apex: 6.4, nordic: 4.0, shenzhen: 6.4, medina: 3.4, porto: 2.4 },
  { month: 'Mar 26', apex: 7.0, nordic: 4.2, shenzhen: 6.2, medina: 3.2, porto: 2.3 },
  { month: 'Apr 26', apex: 7.2, nordic: 4.6, shenzhen: 6.5, medina: 3.5, porto: 2.1 },
  { month: 'May 26', apex: 7.8, nordic: 4.9, shenzhen: 6.8, medina: 3.3, porto: 2.2 },
  { month: 'Jun 26', apex: 8.1, nordic: 5.0, shenzhen: 6.9, medina: 3.1, porto: 2.0 },
  { month: 'Jul 26', apex: 8.4, nordic: 5.1, shenzhen: 6.8, medina: 3.2, porto: 2.1 },
];

const lines = [
  { key: 'apex',     name: 'Apex Fabrics',     color: '#e84545' },
  { key: 'shenzhen', name: 'Shenzhen Gear',     color: '#fb923c' },
  { key: 'nordic',   name: 'Nordic Textiles',   color: '#f59e0b' },
  { key: 'medina',   name: 'Medina Leather',    color: '#3b82f6' },
  { key: 'porto',    name: 'Porto Linen',        color: '#22c55e' },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-elevated p-3 min-w-[180px]">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      {payload.map(p => (
        <div key={`sup-tooltip-${p.name}`} className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-xs text-muted-foreground">{p.name}</span>
          </div>
          <span className="text-xs font-mono font-medium text-foreground">{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function SupplierDefectChartInner() {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Supplier Defect Rate — 12-Month Trend</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Month-over-month using LAG() window function (Query 10 · v_supplier_trend)</p>
        </div>
        <span className="text-xs text-muted-foreground font-mono">Aug 2025 – Jul 2026</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}%`}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--muted-foreground)', paddingTop: '12px' }} />
          {lines.map(l => (
            <Line
              key={`line-${l.key}`}
              type="monotone"
              dataKey={l.key}
              name={l.name}
              stroke={l.color}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}