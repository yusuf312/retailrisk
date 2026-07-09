import React from 'react';
import { RefreshCw, Download, AlertTriangle } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-semibold text-foreground">Risk Dashboard</h1>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-negative-bg text-primary border border-primary/30">
            <AlertTriangle size={10} />
            3 Critical
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Revenue leakage intelligence — last updated <span className="font-mono text-foreground">Jul 09, 2026 08:29 UTC</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <select className="text-xs font-medium bg-muted text-muted-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 90 days</option>
          <option>This quarter</option>
        </select>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors">
          <RefreshCw size={13} />
          Refresh
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 active:scale-95">
          <Download size={13} />
          Export Report
        </button>
      </div>
    </div>
  );
}