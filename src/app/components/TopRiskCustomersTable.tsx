import React from 'react';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

const topCustomers = [
  { id: 'cust-0041', name: 'Priya Nair', riskScore: 94, returnRate: '78%', discountAbuse: true, churnRisk: true, totalSpend: '$12,440', leakage: '$4,210', level: 'critical' as const },
  { id: 'cust-0187', name: 'Dmitri Volkov', riskScore: 88, returnRate: '65%', discountAbuse: true, churnRisk: false, totalSpend: '$8,920', leakage: '$3,780', level: 'critical' as const },
  { id: 'cust-0302', name: 'Amara Osei', riskScore: 76, returnRate: '52%', discountAbuse: false, churnRisk: true, totalSpend: '$15,330', leakage: '$2,940', level: 'high' as const },
  { id: 'cust-0519', name: 'Lena Brandt', riskScore: 71, returnRate: '48%', discountAbuse: true, churnRisk: false, totalSpend: '$6,780', leakage: '$2,100', level: 'high' as const },
  { id: 'cust-0634', name: 'James Okafor', riskScore: 63, returnRate: '41%', discountAbuse: false, churnRisk: true, totalSpend: '$9,210', leakage: '$1,840', level: 'medium' as const },
];

export default function TopRiskCustomersTable() {
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Top High-Risk Customers</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Ranked by composite risk score — requires immediate review</p>
        </div>
        <Link
          href="/customer-risk-management"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Customer ID', 'Name', 'Risk Score', 'Return Rate', 'Discount Abuse', 'Churn Risk', 'Total Spend', 'Leakage $'].map((col) => (
                <th key={`col-top-${col}`} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((c) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{c.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.riskScore >= 80 ? 'bg-primary' : c.riskScore >= 60 ? 'bg-warning' : 'bg-positive'}`}
                        style={{ width: `${c.riskScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-foreground">{c.riskScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-foreground">{c.returnRate}</td>
                <td className="px-4 py-3">
                  {c.discountAbuse
                    ? <span className="text-xs font-medium text-primary">● Flagged</span>
                    : <span className="text-xs text-muted-foreground">—</span>
                  }
                </td>
                <td className="px-4 py-3">
                  {c.churnRisk
                    ? <span className="text-xs font-medium text-warning">● At Risk</span>
                    : <span className="text-xs text-muted-foreground">—</span>
                  }
                </td>
                <td className="px-4 py-3 font-mono text-xs text-foreground tabular-nums">{c.totalSpend}</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-semibold text-primary tabular-nums">{c.leakage}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}