'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { TruckIcon, Users, Download, TrendingUp, TrendingDown } from 'lucide-react';
import RiskBadge from '@/components/ui/RiskBadge';
import SupplierDefectChart from './SupplierDefectChart';
import EmployeeDiscountChart from './EmployeeDiscountChart';
import Icon from '@/components/ui/AppIcon';


type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

interface Supplier {
  id: string;
  name: string;
  country: string;
  category: string;
  defectRatePct: number;
  returnRatePct: number;
  momChangePct: number;
  totalOrders: number;
  returnedValue: number;
  riskLevel: RiskLevel;
  trend: 'up' | 'down' | 'flat';
}

interface Employee {
  id: string;
  name: string;
  department: string;
  avgDiscountPct: number;
  teamAvgPct: number;
  stdDevsAbove: number;
  ordersProcessed: number;
  totalDiscountGiven: number;
  anomalyScore: number;
  flaggedTransactions: number;
  riskLevel: RiskLevel;
  hireDate: string;
}

const suppliers: Supplier[] = [
  { id: 'sup-0014', name: 'Apex Fabrics Ltd.', country: 'Bangladesh', category: 'Apparel', defectRatePct: 8.4, returnRatePct: 18.2, momChangePct: 18.0, totalOrders: 4210, returnedValue: 38890, riskLevel: 'critical', trend: 'up' },
  { id: 'sup-0027', name: 'Nordic Textiles AS', country: 'Denmark', category: 'Knitwear', defectRatePct: 5.1, returnRatePct: 12.4, momChangePct: 9.2, totalOrders: 2840, returnedValue: 22140, riskLevel: 'high', trend: 'up' },
  { id: 'sup-0038', name: 'Shenzhen Gear Co.', country: 'China', category: 'Accessories', defectRatePct: 6.8, returnRatePct: 14.9, momChangePct: 7.1, totalOrders: 6120, returnedValue: 19870, riskLevel: 'high', trend: 'up' },
  { id: 'sup-0051', name: 'Medina Leather Works', country: 'Morocco', category: 'Leather Goods', defectRatePct: 3.2, returnRatePct: 8.1, momChangePct: 2.4, totalOrders: 1890, returnedValue: 11240, riskLevel: 'medium', trend: 'flat' },
  { id: 'sup-0063', name: 'Porto Linen S.A.', country: 'Portugal', category: 'Linen', defectRatePct: 2.1, returnRatePct: 5.8, momChangePct: -1.2, totalOrders: 3140, returnedValue: 8420, riskLevel: 'low', trend: 'down' },
  { id: 'sup-0079', name: 'Colombo Sport Goods', country: 'Sri Lanka', category: 'Sportswear', defectRatePct: 1.8, returnRatePct: 4.9, momChangePct: -3.1, totalOrders: 2410, returnedValue: 6810, riskLevel: 'low', trend: 'down' },
  { id: 'sup-0091', name: 'Istanbul Wool Co.', country: 'Turkey', category: 'Wool Goods', defectRatePct: 4.4, returnRatePct: 10.2, momChangePct: 4.8, totalOrders: 1680, returnedValue: 14220, riskLevel: 'medium', trend: 'up' },
  { id: 'sup-0104', name: 'Osaka Precision Mfg.', country: 'Japan', category: 'Hardware', defectRatePct: 0.9, returnRatePct: 2.1, momChangePct: -0.4, totalOrders: 980, returnedValue: 2140, riskLevel: 'low', trend: 'flat' },
];

const employees: Employee[] = [
  { id: 'emp-0029', name: 'Marcus Torres', department: 'Sales Floor', avgDiscountPct: 28.4, teamAvgPct: 11.2, stdDevsAbove: 3.1, ordersProcessed: 142, totalDiscountGiven: 8841, anomalyScore: 91, flaggedTransactions: 38, riskLevel: 'critical', hireDate: '2024-03-15' },
  { id: 'emp-0041', name: 'Nadia Okonkwo', department: 'Online Sales', avgDiscountPct: 22.1, teamAvgPct: 11.2, stdDevsAbove: 2.4, ordersProcessed: 98, totalDiscountGiven: 5412, anomalyScore: 74, flaggedTransactions: 21, riskLevel: 'high', hireDate: '2023-11-08' },
  { id: 'emp-0014', name: 'Ryan Callahan', department: 'Sales Floor', avgDiscountPct: 19.8, teamAvgPct: 11.2, stdDevsAbove: 2.1, ordersProcessed: 201, totalDiscountGiven: 4820, anomalyScore: 68, flaggedTransactions: 14, riskLevel: 'high', hireDate: '2022-06-20' },
  { id: 'emp-0057', name: 'Fatou Diallo', department: 'Returns Desk', avgDiscountPct: 18.3, teamAvgPct: 11.2, stdDevsAbove: 1.9, ordersProcessed: 77, totalDiscountGiven: 3210, anomalyScore: 61, flaggedTransactions: 9, riskLevel: 'medium', hireDate: '2024-01-10' },
  { id: 'emp-0082', name: 'Jae-Won Park', department: 'Online Sales', avgDiscountPct: 17.1, teamAvgPct: 11.2, stdDevsAbove: 1.7, ordersProcessed: 154, totalDiscountGiven: 2907, anomalyScore: 54, flaggedTransactions: 7, riskLevel: 'medium', hireDate: '2023-08-22' },
  { id: 'emp-0118', name: 'Ingrid Svensson', department: 'Sales Floor', avgDiscountPct: 13.4, teamAvgPct: 11.2, stdDevsAbove: 0.6, ordersProcessed: 188, totalDiscountGiven: 1840, anomalyScore: 28, flaggedTransactions: 2, riskLevel: 'low', hireDate: '2021-04-05' },
  { id: 'emp-0134', name: 'Tariq Hassan', department: 'Online Sales', avgDiscountPct: 12.1, teamAvgPct: 11.2, stdDevsAbove: 0.3, ordersProcessed: 241, totalDiscountGiven: 1420, anomalyScore: 18, flaggedTransactions: 1, riskLevel: 'low', hireDate: '2020-09-14' },
  { id: 'emp-0149', name: 'Elena Popescu', department: 'Sales Floor', avgDiscountPct: 10.8, teamAvgPct: 11.2, stdDevsAbove: -0.1, ordersProcessed: 167, totalDiscountGiven: 980, anomalyScore: 8, flaggedTransactions: 0, riskLevel: 'low', hireDate: '2019-11-30' },
];

type TabType = 'suppliers' | 'employees';

export default function SupplierEmployeeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('suppliers');
  const [supplierSort, setSupplierSort] = useState<{ field: keyof Supplier; dir: 'asc' | 'desc' }>({ field: 'momChangePct', dir: 'desc' });
  const [employeeSort, setEmployeeSort] = useState<{ field: keyof Employee; dir: 'asc' | 'desc' }>({ field: 'anomalyScore', dir: 'desc' });

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    const av = a[supplierSort.field] as number;
    const bv = b[supplierSort.field] as number;
    return supplierSort.dir === 'desc' ? bv - av : av - bv;
  });

  const sortedEmployees = [...employees].sort((a, b) => {
    const av = a[employeeSort.field] as number;
    const bv = b[employeeSort.field] as number;
    return employeeSort.dir === 'desc' ? bv - av : av - bv;
  });

  const toggleSupplierSort = (field: keyof Supplier) => {
    setSupplierSort(prev => prev.field === field
      ? { field, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
      : { field, dir: 'desc' }
    );
  };

  const toggleEmployeeSort = (field: keyof Employee) => {
    setEmployeeSort(prev => prev.field === field
      ? { field, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
      : { field, dir: 'desc' }
    );
  };

  const SupplierSortIcon = ({ field }: { field: keyof Supplier }) => {
    if (supplierSort.field !== field) return <span className="opacity-30">↕</span>;
    return <span className="text-primary">{supplierSort.dir === 'desc' ? '↓' : '↑'}</span>;
  };

  const EmployeeSortIcon = ({ field }: { field: keyof Employee }) => {
    if (employeeSort.field !== field) return <span className="opacity-30">↕</span>;
    return <span className="text-primary">{employeeSort.dir === 'desc' ? '↓' : '↑'}</span>;
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Supplier & Employee Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Defect trends from <span className="font-mono text-foreground">v_supplier_trend</span> · Discount anomalies from <span className="font-mono text-foreground">v_employee_discount_anomalies</span>
          </p>
        </div>
        <button
          onClick={() => toast.success(`Exporting ${activeTab} analytics report`)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 self-start"
        >
          <Download size={13} />
          Export Report
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3">
        {[
          { label: 'Suppliers Monitored', value: '8', sub: '3 at elevated risk', color: 'text-foreground' },
          { label: 'Highest Defect Rise', value: '+18.0%', sub: 'Apex Fabrics Ltd. MoM', color: 'text-primary' },
          { label: 'Employees Flagged', value: '5', sub: 'Above 2σ discount threshold', color: 'text-warning' },
          { label: 'Total Discount Exposure', value: '$27,250', sub: 'Anomalous transactions', color: 'text-primary' },
        ].map(s => (
          <div key={`se-summary-${s.label}`} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-bold tabular-nums mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {([
          { key: 'suppliers', label: 'Supplier Defect Trends', icon: TruckIcon },
          { key: 'employees', label: 'Employee Discount Anomalies', icon: Users },
        ] as const).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                activeTab === tab.key
                  ? 'bg-card text-foreground shadow-card'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          {/* Supplier chart */}
          <SupplierDefectChart />

          {/* Supplier table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Supplier Defect & Return Rate Detail</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Query 10 — window function MoM comparison · sorted by rising risk</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    {[
                      { label: 'Supplier', key: 'th-sup-name' },
                      { label: 'Country', key: 'th-sup-country' },
                      { label: 'Category', key: 'th-sup-cat' },
                      { label: 'Defect Rate', field: 'defectRatePct' as keyof Supplier, key: 'th-sup-defect' },
                      { label: 'Return Rate', field: 'returnRatePct' as keyof Supplier, key: 'th-sup-return' },
                      { label: 'MoM Change', field: 'momChangePct' as keyof Supplier, key: 'th-sup-mom' },
                      { label: 'Total Orders', field: 'totalOrders' as keyof Supplier, key: 'th-sup-orders' },
                      { label: 'Returned Value', field: 'returnedValue' as keyof Supplier, key: 'th-sup-value' },
                      { label: 'Risk Level', key: 'th-sup-risk' },
                    ].map(col => (
                      <th
                        key={col.key}
                        onClick={() => col.field && toggleSupplierSort(col.field)}
                        className={`px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap ${col.field ? 'cursor-pointer hover:text-foreground select-none' : ''}`}
                      >
                        {col.field ? (
                          <span className="flex items-center gap-1">{col.label} <SupplierSortIcon field={col.field} /></span>
                        ) : col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedSuppliers.map((s, idx) => (
                    <tr key={s.id} className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{s.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{s.country}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{s.category}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono font-semibold tabular-nums ${s.defectRatePct > 5 ? 'text-primary' : s.defectRatePct > 3 ? 'text-warning' : 'text-positive'}`}>
                          {s.defectRatePct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono font-semibold tabular-nums ${s.returnRatePct > 12 ? 'text-primary' : s.returnRatePct > 8 ? 'text-warning' : 'text-positive'}`}>
                          {s.returnRatePct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1 text-xs font-semibold tabular-nums ${s.momChangePct > 5 ? 'text-primary' : s.momChangePct < 0 ? 'text-positive' : 'text-muted-foreground'}`}>
                          {s.momChangePct > 0 ? <TrendingUp size={12} /> : s.momChangePct < 0 ? <TrendingDown size={12} /> : null}
                          {s.momChangePct > 0 ? '+' : ''}{s.momChangePct.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground tabular-nums">{s.totalOrders.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary tabular-nums">${s.returnedValue.toLocaleString()}</td>
                      <td className="px-4 py-3"><RiskBadge level={s.riskLevel} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="space-y-4">
          {/* Employee chart */}
          <EmployeeDiscountChart employees={employees} />

          {/* Employee table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Employee Discount Anomaly Detail</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Query 6 — reps flagged above peer average · team avg: 11.2%</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    {[
                      { label: 'Employee', key: 'th-emp-name' },
                      { label: 'Department', key: 'th-emp-dept' },
                      { label: 'Avg Discount %', field: 'avgDiscountPct' as keyof Employee, key: 'th-emp-avg' },
                      { label: 'Std Devs Above', field: 'stdDevsAbove' as keyof Employee, key: 'th-emp-std' },
                      { label: 'Orders Processed', field: 'ordersProcessed' as keyof Employee, key: 'th-emp-orders' },
                      { label: 'Total Discount $', field: 'totalDiscountGiven' as keyof Employee, key: 'th-emp-total' },
                      { label: 'Flagged Txns', field: 'flaggedTransactions' as keyof Employee, key: 'th-emp-flagged' },
                      { label: 'Anomaly Score', field: 'anomalyScore' as keyof Employee, key: 'th-emp-score' },
                      { label: 'Risk Level', key: 'th-emp-risk' },
                    ].map(col => (
                      <th
                        key={col.key}
                        onClick={() => col.field && toggleEmployeeSort(col.field)}
                        className={`px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap ${col.field ? 'cursor-pointer hover:text-foreground select-none' : ''}`}
                      >
                        {col.field ? (
                          <span className="flex items-center gap-1">{col.label} <EmployeeSortIcon field={col.field} /></span>
                        ) : col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedEmployees.map((e, idx) => (
                    <tr key={e.id} className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{e.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{e.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{e.department}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${e.avgDiscountPct > 20 ? 'bg-primary' : e.avgDiscountPct > 15 ? 'bg-warning' : 'bg-positive'}`}
                              style={{ width: `${Math.min((e.avgDiscountPct / 35) * 100, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-mono font-semibold tabular-nums ${e.avgDiscountPct > 20 ? 'text-primary' : e.avgDiscountPct > 15 ? 'text-warning' : 'text-foreground'}`}>
                            {e.avgDiscountPct.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono font-semibold tabular-nums ${e.stdDevsAbove >= 2 ? 'text-primary' : e.stdDevsAbove >= 1 ? 'text-warning' : 'text-muted-foreground'}`}>
                          {e.stdDevsAbove > 0 ? '+' : ''}{e.stdDevsAbove.toFixed(1)}σ
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground tabular-nums">{e.ordersProcessed.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary tabular-nums">${e.totalDiscountGiven.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono font-semibold tabular-nums ${e.flaggedTransactions > 10 ? 'text-primary' : e.flaggedTransactions > 5 ? 'text-warning' : 'text-foreground'}`}>
                          {e.flaggedTransactions}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${e.anomalyScore >= 70 ? 'bg-primary' : e.anomalyScore >= 50 ? 'bg-warning' : 'bg-positive'}`}
                              style={{ width: `${e.anomalyScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold tabular-nums text-foreground">{e.anomalyScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><RiskBadge level={e.riskLevel} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border bg-muted/10 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Team average discount: <span className="font-mono font-semibold text-foreground">11.2%</span> · Flagged threshold: <span className="font-mono font-semibold text-foreground">2σ above mean</span>
              </p>
              <button
                onClick={() => toast.success('Exporting employee anomaly report')}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Download size={12} /> Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}