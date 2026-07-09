'use client';
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

interface Customer {
  id: string;
  compositeScore: number;
  riskLevel: string;
}

export default function CustomerRiskDistributionChartInner({ customers }: { customers: Customer[] }) {
  const critical = customers.filter(c => c.riskLevel === 'critical').length;
  const high = customers.filter(c => c.riskLevel === 'high').length;
  const medium = customers.filter(c => c.riskLevel === 'medium').length;
  const low = customers.filter(c => c.riskLevel === 'low').length;
  const total = customers.length;

  const data = [
    { name: 'Critical', value: Math.round((critical / total) * 100), fill: 'var(--primary)', count: critical },
    { name: 'High',     value: Math.round((high / total) * 100),     fill: '#fb923c',          count: high },
    { name: 'Medium',   value: Math.round((medium / total) * 100),   fill: 'var(--warning)',   count: medium },
    { name: 'Low',      value: Math.round((low / total) * 100),      fill: 'var(--positive)',  count: low },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Risk Score Distribution</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Composite score breakdown — {total} customers</p>
        </div>
        <div className="flex items-center gap-4">
          {data.map(d => (
            <div key={`dist-legend-${d.name}`} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
              <span className="text-xs text-muted-foreground">{d.name}</span>
              <span className="text-xs font-semibold text-foreground tabular-nums">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <RadialBarChart cx="50%" cy="120%" innerRadius="60%" outerRadius="100%" startAngle={180} endAngle={0} data={data}>
          <RadialBar dataKey="value" cornerRadius={3} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-card border border-border rounded-md px-3 py-2 shadow-elevated">
                  <p className="text-xs font-semibold text-foreground">{d.name} Risk</p>
                  <p className="text-xs text-muted-foreground">{d.count} customers ({d.value}%)</p>
                </div>
              );
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}