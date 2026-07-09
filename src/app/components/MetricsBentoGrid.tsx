import React from 'react';
import {
  TrendingDown, TrendingUp, AlertTriangle, Package,
  UserX, Truck, DollarSign, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


// Bento grid plan: 7 cards → grid-cols-4
// Row 1: Hero (spans 2 cols) + 2 regular = 4 cols
// Row 2: 4 regular cards = 4 cols (last one spans 1)
// Actually: 7 cards → hero spans 2, row1: hero(2) + 2 = 4, row2: 4 regular = 4 total ✓

const metrics = [
  {
    id: 'metric-total-leaked',
    hero: true,
    label: 'Total Leaked Revenue',
    value: '$284,719',
    delta: '+$18,340 vs last period',
    trend: 'up',
    icon: DollarSign,
    iconBg: 'bg-negative-bg',
    iconColor: 'text-primary',
    context: 'Across all 13 risk categories',
    alert: true,
  },
  {
    id: 'metric-pricing-errors',
    label: 'Pricing Error Exposure',
    value: '$41,230',
    delta: '+8.3% this week',
    trend: 'up',
    icon: TrendingDown,
    iconBg: 'bg-negative-bg',
    iconColor: 'text-primary',
    context: '127 items sold below cost',
    alert: true,
  },
  {
    id: 'metric-discount-abuse',
    label: 'Discount Abuse',
    value: '$38,870',
    delta: '+2.1% this week',
    trend: 'up',
    icon: AlertTriangle,
    iconBg: 'bg-warning-bg',
    iconColor: 'text-warning',
    context: '34 orders >2σ above avg discount',
    alert: false,
  },
  {
    id: 'metric-return-fraud',
    label: 'Return Fraud Exposure',
    value: '$62,100',
    delta: '-3.2% vs last week',
    trend: 'down',
    icon: UserX,
    iconBg: 'bg-orange-950',
    iconColor: 'text-orange-400',
    context: '18 customers >50% return rate',
    alert: false,
  },
  {
    id: 'metric-shrinkage',
    label: 'Inventory Shrinkage',
    value: '$79,440',
    delta: '+12.7% this month',
    trend: 'up',
    icon: Package,
    iconBg: 'bg-negative-bg',
    iconColor: 'text-primary',
    context: 'Expected vs actual mismatch',
    alert: true,
  },
  {
    id: 'metric-employee-anomaly',
    label: 'Employee Discount Anomalies',
    value: '$24,190',
    delta: 'Stable vs last period',
    trend: 'neutral',
    icon: TrendingUp,
    iconBg: 'bg-info-bg',
    iconColor: 'text-info',
    context: '5 reps flagged above peer avg',
    alert: false,
  },
  {
    id: 'metric-supplier-risk',
    label: 'Supplier Risk Exposure',
    value: '$38,889',
    delta: '-5.4% MoM trend',
    trend: 'down',
    icon: Truck,
    iconBg: 'bg-positive-bg',
    iconColor: 'text-positive',
    context: '3 suppliers rising defect rate',
    alert: false,
  },
];

interface MetricCardProps {
  metric: typeof metrics[0];
}

function MetricCard({ metric }: MetricCardProps) {
  const Icon = metric.icon;
  const isUp = metric.trend === 'up';
  const isDown = metric.trend === 'down';

  return (
    <div
      className={`
        relative bg-card border rounded-lg p-4 card-hover flex flex-col gap-3
        ${metric.alert ? 'border-primary/30 shadow-glow' : 'border-border'}
        ${metric.hero ? 'col-span-2' : ''}
      `}
    >
      {metric.alert && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg ${metric.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} className={metric.iconColor} />
        </div>
        {metric.hero && (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            North Star
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{metric.label}</p>
        <p className={`font-bold tabular-nums text-foreground ${metric.hero ? 'text-metric-lg' : 'text-2xl'}`}>
          {metric.value}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <p className="text-xs text-muted-foreground">{metric.context}</p>
        <div className={`flex items-center gap-1 text-xs font-medium tabular-nums ${
          isUp ? 'text-primary' : isDown ? 'text-positive' : 'text-muted-foreground'
        }`}>
          {isUp && <ArrowUpRight size={12} />}
          {isDown && <ArrowDownRight size={12} />}
          {metric.delta}
        </div>
      </div>
    </div>
  );
}

export default function MetricsBentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}