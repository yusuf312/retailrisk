'use client';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Search, Download, X, AlertTriangle, Eye, Flag, CheckCircle,  } from 'lucide-react';
import RiskBadge from '@/components/ui/RiskBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CustomerRiskDistributionChart from './CustomerRiskDistributionChart';

type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'clear';
type StatusType = 'flagged' | 'under_review' | 'escalated' | 'resolved' | 'cleared';
type RFMTier = 'Champions' | 'Loyal' | 'Potential' | 'At Risk' | 'Needs Attention' | 'Lost' | 'Cannot Lose';

interface Customer {
  id: string;
  name: string;
  email: string;
  compositeScore: number;
  riskLevel: RiskLevel;
  rfmTier: RFMTier;
  returnRate: number;
  discountAbuse: boolean;
  churnRisk: boolean;
  duplicateOrders: boolean;
  totalSpend: number;
  leakage: number;
  flagCount: number;
  lastOrder: string;
  status: StatusType;
}

const allCustomers: Customer[] = [
  { id: 'cust-0041', name: 'Priya Nair', email: 'p.nair@gmail.com', compositeScore: 94, riskLevel: 'critical', rfmTier: 'At Risk', returnRate: 78.2, discountAbuse: true, churnRisk: true, duplicateOrders: false, totalSpend: 12440, leakage: 4210, flagCount: 4, lastOrder: '2026-07-08', status: 'escalated' },
  { id: 'cust-0187', name: 'Dmitri Volkov', email: 'd.volkov@outlook.com', compositeScore: 88, riskLevel: 'critical', rfmTier: 'At Risk', returnRate: 64.7, discountAbuse: true, churnRisk: false, duplicateOrders: true, totalSpend: 8920, leakage: 3780, flagCount: 3, lastOrder: '2026-07-07', status: 'flagged' },
  { id: 'cust-0302', name: 'Amara Osei', email: 'amara.osei@yahoo.com', compositeScore: 76, riskLevel: 'high', rfmTier: 'Potential', returnRate: 54.8, discountAbuse: false, churnRisk: true, duplicateOrders: true, totalSpend: 15330, leakage: 2940, flagCount: 2, lastOrder: '2026-07-06', status: 'under_review' },
  { id: 'cust-0519', name: 'Lena Brandt', email: 'l.brandt@gmail.com', compositeScore: 71, riskLevel: 'high', rfmTier: 'Needs Attention', returnRate: 50.0, discountAbuse: true, churnRisk: false, duplicateOrders: false, totalSpend: 6780, leakage: 2100, flagCount: 2, lastOrder: '2026-07-04', status: 'under_review' },
  { id: 'cust-0634', name: 'James Okafor', email: 'j.okafor@hotmail.com', compositeScore: 63, riskLevel: 'medium', rfmTier: 'Potential', returnRate: 41.0, discountAbuse: false, churnRisk: true, duplicateOrders: false, totalSpend: 9210, leakage: 1840, flagCount: 2, lastOrder: '2026-07-03', status: 'flagged' },
  { id: 'cust-0712', name: 'Yuki Tanaka', email: 'y.tanaka@gmail.com', compositeScore: 67, riskLevel: 'medium', rfmTier: 'Needs Attention', returnRate: 52.6, discountAbuse: false, churnRisk: false, duplicateOrders: false, totalSpend: 7440, leakage: 1620, flagCount: 1, lastOrder: '2026-07-02', status: 'under_review' },
  { id: 'cust-0829', name: 'Elena Rossi', email: 'e.rossi@gmail.com', compositeScore: 58, riskLevel: 'medium', rfmTier: 'Lost', returnRate: 38.1, discountAbuse: false, churnRisk: true, duplicateOrders: false, totalSpend: 4210, leakage: 980, flagCount: 1, lastOrder: '2026-05-14', status: 'flagged' },
  { id: 'cust-0944', name: 'Omar Farouk', email: 'o.farouk@outlook.com', compositeScore: 44, riskLevel: 'low', rfmTier: 'Loyal', returnRate: 22.4, discountAbuse: false, churnRisk: false, duplicateOrders: false, totalSpend: 18920, leakage: 420, flagCount: 1, lastOrder: '2026-07-05', status: 'resolved' },
  { id: 'cust-1021', name: 'Sofia Petrov', email: 's.petrov@gmail.com', compositeScore: 51, riskLevel: 'medium', rfmTier: 'Needs Attention', returnRate: 33.8, discountAbuse: true, churnRisk: false, duplicateOrders: false, totalSpend: 5640, leakage: 1120, flagCount: 1, lastOrder: '2026-06-28', status: 'under_review' },
  { id: 'cust-1108', name: 'Kwame Asante', email: 'k.asante@gmail.com', compositeScore: 29, riskLevel: 'low', rfmTier: 'Champions', returnRate: 8.4, discountAbuse: false, churnRisk: false, duplicateOrders: false, totalSpend: 28410, leakage: 180, flagCount: 0, lastOrder: '2026-07-09', status: 'cleared' },
  { id: 'cust-1244', name: 'Fatima Al-Hassan', email: 'f.alhassan@yahoo.com', compositeScore: 36, riskLevel: 'low', rfmTier: 'Loyal', returnRate: 14.2, discountAbuse: false, churnRisk: false, duplicateOrders: false, totalSpend: 11280, leakage: 290, flagCount: 0, lastOrder: '2026-07-07', status: 'cleared' },
  { id: 'cust-1380', name: 'Carlos Mendez', email: 'c.mendez@hotmail.com', compositeScore: 55, riskLevel: 'medium', rfmTier: 'Potential', returnRate: 31.0, discountAbuse: false, churnRisk: true, duplicateOrders: false, totalSpend: 6920, leakage: 860, flagCount: 1, lastOrder: '2026-06-20', status: 'flagged' },
];

const rfmColors: Record<RFMTier, string> = {
  Champions:       'text-positive bg-positive-bg border-positive/30',
  Loyal:           'text-info bg-info-bg border-info/30',
  Potential:       'text-foreground bg-muted border-border',
  'At Risk':       'text-primary bg-negative-bg border-primary/30',
  'Needs Attention': 'text-warning bg-warning-bg border-warning/30',
  Lost:            'text-muted-foreground bg-muted border-border',
  'Cannot Lose':   'text-orange-400 bg-orange-950 border-orange-400/30',
};

type SortField = 'compositeScore' | 'returnRate' | 'totalSpend' | 'leakage' | 'flagCount' | 'lastOrder';
type SortDir = 'asc' | 'desc';

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-primary' : score >= 60 ? 'bg-warning' : score >= 40 ? 'bg-orange-400' : 'bg-positive';
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums text-foreground">{score}</span>
    </div>
  );
}

interface CustomerDetailPanelProps {
  customer: Customer;
  onClose: () => void;
  onStatusChange: (id: string, status: StatusType) => void;
}

function CustomerDetailPanel({ customer, onClose, onStatusChange }: CustomerDetailPanelProps) {
  const flags = [
    { label: 'Return Rate', value: `${customer.returnRate}%`, flagged: customer.returnRate > 50, detail: 'Above 50% threshold — return fraud pattern detected' },
    { label: 'Discount Abuse', value: customer.discountAbuse ? 'Flagged' : 'Clear', flagged: customer.discountAbuse, detail: customer.discountAbuse ? 'Orders discounted >2σ above average' : 'Within normal range' },
    { label: 'Churn Risk', value: customer.churnRisk ? 'At Risk' : 'Stable', flagged: customer.churnRisk, detail: customer.churnRisk ? 'No repeat order after late shipment in 90d window' : 'Regular purchase cadence' },
    { label: 'Duplicate Orders', value: customer.duplicateOrders ? 'Detected' : 'None', flagged: customer.duplicateOrders, detail: customer.duplicateOrders ? 'Same SKU/amount within 1-hour window' : 'No duplicates detected' },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 bg-card border-l border-border shadow-elevated flex flex-col slide-up">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Customer Detail</h3>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Identity */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-foreground">{customer.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{customer.name}</p>
            <p className="text-xs text-muted-foreground">{customer.email}</p>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">{customer.id}</p>
          </div>
        </div>

        {/* Score */}
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Composite Risk Score</span>
            <RiskBadge level={customer.riskLevel} />
          </div>
          <p className="text-3xl font-bold tabular-nums text-foreground">{customer.compositeScore}<span className="text-sm text-muted-foreground">/100</span></p>
          <div className="w-full h-2 bg-secondary rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${customer.compositeScore >= 80 ? 'bg-primary' : customer.compositeScore >= 60 ? 'bg-warning' : 'bg-positive'}`}
              style={{ width: `${customer.compositeScore}%` }}
            />
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Total Spend', value: `$${customer.totalSpend.toLocaleString()}` },
            { label: 'Leakage $', value: `$${customer.leakage.toLocaleString()}`, red: true },
            { label: 'RFM Tier', value: customer.rfmTier },
            { label: 'Last Order', value: customer.lastOrder },
          ].map((s) => (
            <div key={`detail-stat-${s.label}`} className="bg-muted rounded-md p-2.5">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-sm font-semibold tabular-nums mt-0.5 ${s.red ? 'text-primary' : 'text-foreground'}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Flags */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Risk Flags</p>
          <div className="space-y-2">
            {flags.map((flag) => (
              <div key={`flag-${flag.label}`} className={`flex items-start gap-2 p-2.5 rounded-md border ${flag.flagged ? 'bg-negative-bg border-primary/20' : 'bg-muted border-border'}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${flag.flagged ? 'bg-primary/20' : 'bg-positive/20'}`}>
                  {flag.flagged ? <AlertTriangle size={9} className="text-primary" /> : <CheckCircle size={9} className="text-positive" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{flag.label}</span>
                    <span className={`text-xs font-mono ${flag.flagged ? 'text-primary' : 'text-positive'}`}>{flag.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{flag.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status change */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Review Status</p>
          <div className="grid grid-cols-1 gap-1.5">
            {(['flagged', 'under_review', 'escalated', 'resolved', 'cleared'] as StatusType[]).map((s) => (
              <button
                key={`status-opt-${s}`}
                onClick={() => onStatusChange(customer.id, s)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-colors text-left ${
                  customer.status === s
                    ? 'bg-primary/10 text-primary border-primary/30' :'bg-muted text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                {customer.status === s && <CheckCircle size={12} />}
                {s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerRiskScreen() {
  const [customers, setCustomers] = useState<Customer[]>(allCustomers);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [rfmFilter, setRfmFilter] = useState<RFMTier | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('compositeScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; action: string; ids: string[] }>({ open: false, action: '', ids: [] });

  const filtered = useMemo(() => {
    let result = customers.filter((c) => {
      const matchSearch = search === '' || c.name.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchRisk = riskFilter === 'all' || c.riskLevel === riskFilter;
      const matchRfm = rfmFilter === 'all' || c.rfmTier === rfmFilter;
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchRisk && matchRfm && matchStatus;
    });
    result = [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
      }
      return sortDir === 'desc'
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });
    return result;
  }, [customers, search, riskFilter, rfmFilter, statusFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(c => c.id)));
  };

  const handleStatusChange = (id: string, status: StatusType) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (detailCustomer?.id === id) setDetailCustomer(prev => prev ? { ...prev, status } : null);
    toast.success(`Status updated to ${status.replace('_', ' ')}`);
  };

  const handleBulkEscalate = () => {
    setConfirmModal({ open: true, action: 'escalate', ids: Array.from(selectedIds) });
  };

  const handleBulkResolve = () => {
    setCustomers(prev => prev.map(c => selectedIds.has(c.id) ? { ...c, status: 'resolved' } : c));
    toast.success(`${selectedIds.size} customers marked as resolved`);
    setSelectedIds(new Set());
  };

  const confirmBulkAction = () => {
    if (confirmModal.action === 'escalate') {
      setCustomers(prev => prev.map(c => confirmModal.ids.includes(c.id) ? { ...c, status: 'escalated' } : c));
      toast.success(`${confirmModal.ids.length} customers escalated`);
      setSelectedIds(new Set());
    }
    setConfirmModal({ open: false, action: '', ids: [] });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="opacity-30 text-muted-foreground">↕</span>;
    return <span className="text-primary">{sortDir === 'desc' ? '↓' : '↑'}</span>;
  };

  const columns: { label: string; field?: SortField; key: string }[] = [
    { label: 'Customer', key: 'col-customer' },
    { label: 'Score', field: 'compositeScore', key: 'col-score' },
    { label: 'Risk Level', key: 'col-risk' },
    { label: 'RFM Tier', key: 'col-rfm' },
    { label: 'Return Rate', field: 'returnRate', key: 'col-return' },
    { label: 'Flags', field: 'flagCount', key: 'col-flags' },
    { label: 'Total Spend', field: 'totalSpend', key: 'col-spend' },
    { label: 'Leakage $', field: 'leakage', key: 'col-leakage' },
    { label: 'Last Order', field: 'lastOrder', key: 'col-lastorder' },
    { label: 'Status', key: 'col-status' },
    { label: '', key: 'col-actions' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Customer Risk Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Composite risk scores from <span className="font-mono text-foreground">v_high_risk_customers</span> · {customers.length} customers tracked
          </p>
        </div>
        <button
          onClick={() => toast.success('Exporting customer risk report as CSV')}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 self-start"
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* Distribution chart */}
      <CustomerRiskDistributionChart customers={customers} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer name, ID, email..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <select
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value as RiskLevel | 'all')}
          className="text-xs font-medium bg-muted text-muted-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Risk Levels</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={rfmFilter}
          onChange={e => setRfmFilter(e.target.value as RFMTier | 'all')}
          className="text-xs font-medium bg-muted text-muted-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All RFM Tiers</option>
          <option value="Champions">Champions</option>
          <option value="Loyal">Loyal</option>
          <option value="At Risk">At Risk</option>
          <option value="Needs Attention">Needs Attention</option>
          <option value="Potential">Potential</option>
          <option value="Lost">Lost</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusType | 'all')}
          className="text-xs font-medium bg-muted text-muted-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Statuses</option>
          <option value="flagged">Flagged</option>
          <option value="under_review">Under Review</option>
          <option value="escalated">Escalated</option>
          <option value="resolved">Resolved</option>
          <option value="cleared">Cleared</option>
        </select>
        {(search || riskFilter !== 'all' || rfmFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => { setSearch(''); setRiskFilter('all'); setRfmFilter('all'); setStatusFilter('all'); }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-border bg-input accent-primary"
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.field && toggleSort(col.field)}
                    className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap ${col.field ? 'cursor-pointer hover:text-foreground select-none' : ''}`}
                  >
                    {col.field ? (
                      <span className="flex items-center gap-1">{col.label} <SortIcon field={col.field} /></span>
                    ) : col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center">
                    <AlertTriangle size={24} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">No customers match your filters</p>
                    <p className="text-xs text-muted-foreground mt-1">Adjust the risk level, RFM tier, or status filters above</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => (
                  <tr
                    key={c.id}
                    className={`border-b border-border/40 transition-colors cursor-pointer ${
                      selectedIds.has(c.id) ? 'bg-primary/5' : idx % 2 === 0 ? 'hover:bg-muted/30' : 'bg-muted/10 hover:bg-muted/30'
                    }`}
                    onClick={() => setDetailCustomer(c)}
                  >
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="w-3.5 h-3.5 rounded border-border bg-input accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground whitespace-nowrap">{c.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">{c.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3"><ScoreBar score={c.compositeScore} /></td>
                    <td className="px-4 py-3"><RiskBadge level={c.riskLevel} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded border ${rfmColors[c.rfmTier]}`}>
                        {c.rfmTier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-mono font-semibold tabular-nums ${c.returnRate > 50 ? 'text-primary' : 'text-foreground'}`}>
                        {c.returnRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {c.discountAbuse && <span className="text-xs px-1.5 py-0.5 rounded bg-warning-bg text-warning border border-warning/20">D</span>}
                        {c.churnRisk && <span className="text-xs px-1.5 py-0.5 rounded bg-info-bg text-info border border-info/20">C</span>}
                        {c.duplicateOrders && <span className="text-xs px-1.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-400/20">X</span>}
                        {c.flagCount === 0 && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground tabular-nums">${c.totalSpend.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-primary tabular-nums">${c.leakage.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.lastOrder}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDetailCustomer(c)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors tooltip-dark"
                          data-tooltip="View detail"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => { handleStatusChange(c.id, 'escalated'); }}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-negative-bg rounded transition-colors tooltip-dark"
                          data-tooltip="Escalate flag"
                        >
                          <Flag size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of <span className="font-semibold text-foreground">{customers.length}</span> customers
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button
                key={`page-${p}`}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${p === 1 ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-card border border-border rounded-xl px-5 py-3 shadow-elevated slide-up">
          <span className="text-sm font-medium text-foreground">{selectedIds.size} selected</span>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={handleBulkEscalate}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-negative-bg text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
          >
            <Flag size={12} /> Escalate All
          </button>
          <button
            onClick={handleBulkResolve}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-positive-bg text-positive border border-positive/30 hover:bg-positive/20 transition-colors"
          >
            <CheckCircle size={12} /> Mark Resolved
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Detail panel */}
      {detailCustomer && (
        <CustomerDetailPanel
          customer={detailCustomer}
          onClose={() => setDetailCustomer(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <ConfirmModal
        open={confirmModal.open}
        title={`Escalate ${confirmModal.ids.length} customer${confirmModal.ids.length > 1 ? 's' : ''}?`}
        description="Escalated customers will be flagged for immediate review by the loss prevention team. This action will be logged in the audit trail."
        confirmLabel="Escalate"
        onConfirm={confirmBulkAction}
        onCancel={() => setConfirmModal({ open: false, action: '', ids: [] })}
      />
    </div>
  );
}