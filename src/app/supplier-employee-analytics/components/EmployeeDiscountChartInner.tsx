'use client';
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';

interface Employee {
  id: string;
  name: string;
  avgDiscountPct: number;
  teamAvgPct: number;
  anomalyScore: number;
  riskLevel: string;
}

const riskColor: Record<string, string> = {
  critical: '#e84545',
  high:     '#fb923c',
  medium:   '#f59e0b',
  low:      '#22c55e',
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-elevated p-3">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      <p className="text-xs text-muted-foreground">Avg Discount: <span className="font-mono font-semibold text-foreground">{payload[0].value.toFixed(1)}%</span></p>
      <p className="text-xs text-muted-foreground">Team Avg: <span className="font-mono text-foreground">11.2%</span></p>
    </div>
  );
}

export default function EmployeeDiscountChartInner({ employees }: { employees: Employee[] }) {
  const chartData = employees.map(e => ({
    name: e.name.split(' ')[0],
    fullName: e.name,
    avgDiscount: e.avgDiscountPct,
    riskLevel: e.riskLevel,
  }));

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Employee Avg Discount % vs Team Average</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Query 6 · v_employee_discount_anomalies — reference line at team avg 11.2%</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-muted-foreground">Critical</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-400" /><span className="text-muted-foreground">High</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-warning" /><span className="text-muted-foreground">Medium</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-positive" /><span className="text-muted-foreground">Low</span></div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}%`}
            width={36}
          />
          <ReferenceLine y={11.2} stroke="var(--border)" strokeDasharray="4 4" label={{ value: 'Team avg 11.2%', fontSize: 10, fill: 'var(--muted-foreground)', position: 'right' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avgDiscount" name="Avg Discount %" radius={[3, 3, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-emp-${index}`} fill={riskColor[entry.riskLevel] ?? '#6b7a99'} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}