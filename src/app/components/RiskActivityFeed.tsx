import React from 'react';
import { AlertTriangle, TrendingDown, Package, UserX, Clock } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const activities = [
  { id: 'act-001', type: 'critical', icon: AlertTriangle, color: 'text-primary', bg: 'bg-negative-bg', message: 'cust-0041 Priya Nair hit 78% return rate — composite score 94', time: '4m ago', category: 'Return Fraud' },
  { id: 'act-002', type: 'warning', icon: TrendingDown, color: 'text-warning', bg: 'bg-warning-bg', message: 'SKU-8821 "Merino Pullover" sold $12.40 below cost — 23 units', time: '17m ago', category: 'Pricing Error' },
  { id: 'act-003', type: 'critical', icon: Package, color: 'text-primary', bg: 'bg-negative-bg', message: 'Warehouse B shrinkage delta reached $4,200 this week', time: '31m ago', category: 'Shrinkage' },
  { id: 'act-004', type: 'warning', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-950', message: 'Rep emp-0029 Marcus T. discounting 3.1σ above team average', time: '1h ago', category: 'Employee' },
  { id: 'act-005', type: 'info', icon: UserX, color: 'text-info', bg: 'bg-info-bg', message: 'Supplier SUP-0014 Apex Fabrics: return rate up 18% MoM', time: '2h ago', category: 'Supplier Risk' },
  { id: 'act-006', type: 'warning', icon: Clock, color: 'text-warning', bg: 'bg-warning-bg', message: '3 window-edge returns filed on day 29 of 30-day policy', time: '3h ago', category: 'Window Returns' },
  { id: 'act-007', type: 'info', icon: AlertTriangle, color: 'text-info', bg: 'bg-info-bg', message: 'Duplicate order detected: cust-0302 × SKU-3341 within 22 min', time: '4h ago', category: 'Duplicate Orders' },
];

export default function RiskActivityFeed() {
  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Recent Risk Flags</h2>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-border/50">
        {activities?.map((act) => {
          const Icon = act?.icon;
          return (
            <div key={act?.id} className="flex gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
              <div className={`w-7 h-7 rounded-lg ${act?.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={13} className={act?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-relaxed">{act?.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground font-mono">{act?.time}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{act?.category}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}