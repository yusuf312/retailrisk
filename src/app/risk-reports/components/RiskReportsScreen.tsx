'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight, Download, TrendingUp, TrendingDown, Minus, FileBarChart2, Filter,  } from 'lucide-react';
import RiskBadge from '@/components/ui/RiskBadge';

type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'clear';

interface ReportRow {
  id: string;
  [key: string]: string | number;
}

interface ReportCategory {
  id: string;
  name: string;
  queryRef: string;
  viewRef: string;
  totalImpact: string;
  rowCount: number;
  trend: 'up' | 'down' | 'flat';
  trendPct: string;
  riskLevel: RiskLevel;
  columns: string[];
  rows: ReportRow[];
}

const reportCategories: ReportCategory[] = [
  {
    id: 'rpt-pricing',
    name: 'Pricing Errors',
    queryRef: 'Query 1',
    viewRef: 'v_pricing_errors',
    totalImpact: '$41,230',
    rowCount: 127,
    trend: 'up',
    trendPct: '+8.3%',
    riskLevel: 'critical',
    columns: ['Order Item ID', 'SKU', 'Product Name', 'Sale Price', 'Cost Price', 'Loss Per Unit', 'Qty Sold', 'Total Loss', 'Order Date', 'Employee'],
    rows: [
      { id: 'oi-0841', sku: 'SKU-8821', product: 'Merino Pullover', salePrice: '$38.40', costPrice: '$50.80', lossPerUnit: '-$12.40', qty: 23, totalLoss: '-$285.20', orderDate: '2026-07-07', employee: 'emp-0029' },
      { id: 'oi-0719', sku: 'SKU-3341', product: 'Canvas Tote Bag', salePrice: '$12.00', costPrice: '$18.50', lossPerUnit: '-$6.50', qty: 41, totalLoss: '-$266.50', orderDate: '2026-07-06', employee: 'emp-0014' },
      { id: 'oi-0632', sku: 'SKU-5502', product: 'Denim Jacket (M)', salePrice: '$64.99', costPrice: '$89.00', lossPerUnit: '-$24.01', qty: 8, totalLoss: '-$192.08', orderDate: '2026-07-05', employee: 'emp-0041' },
      { id: 'oi-0588', sku: 'SKU-7714', product: 'Running Shoes Sz10', salePrice: '$55.00', costPrice: '$72.40', lossPerUnit: '-$17.40', qty: 11, totalLoss: '-$191.40', orderDate: '2026-07-04', employee: 'emp-0029' },
      { id: 'oi-0501', sku: 'SKU-2298', product: 'Linen Shirt (L)', salePrice: '$28.99', costPrice: '$34.20', lossPerUnit: '-$5.21', qty: 34, totalLoss: '-$177.14', orderDate: '2026-07-03', employee: 'emp-0057' },
      { id: 'oi-0477', sku: 'SKU-9031', product: 'Wool Beanie', salePrice: '$9.99', costPrice: '$14.50', lossPerUnit: '-$4.51', qty: 38, totalLoss: '-$171.38', orderDate: '2026-07-02', employee: 'emp-0014' },
      { id: 'oi-0392', sku: 'SKU-4410', product: 'Yoga Mat Pro', salePrice: '$29.00', costPrice: '$41.00', lossPerUnit: '-$12.00', qty: 13, totalLoss: '-$156.00', orderDate: '2026-07-01', employee: 'emp-0029' },
      { id: 'oi-0311', sku: 'SKU-6623', product: 'Bamboo Socks 3-Pack', salePrice: '$7.49', costPrice: '$11.20', lossPerUnit: '-$3.71', qty: 42, totalLoss: '-$155.82', orderDate: '2026-06-30', employee: 'emp-0041' },
    ],
  },
  {
    id: 'rpt-discount',
    name: 'Discount Abuse',
    queryRef: 'Query 2',
    viewRef: 'v_discount_anomalies',
    totalImpact: '$38,870',
    rowCount: 34,
    trend: 'up',
    trendPct: '+2.1%',
    riskLevel: 'high',
    columns: ['Order ID', 'Customer', 'Discount Code', 'Discount %', 'Avg Discount %', 'Std Dev Above', 'Order Value', 'Discount Amount', 'Applied Date', 'Rep'],
    rows: [
      { id: 'ord-7841', customer: 'Dmitri Volkov', discountCode: 'STAFF30+VIP20', discountPct: '47.2%', avgPct: '12.4%', stdDev: '3.8σ', orderValue: '$892.00', discountAmt: '$421.00', appliedDate: '2026-07-08', rep: 'emp-0029' },
      { id: 'ord-7612', customer: 'Priya Nair', discountCode: 'LOYALTY15+SAVE20', discountPct: '33.1%', avgPct: '12.4%', stdDev: '2.9σ', orderValue: '$440.00', discountAmt: '$145.64', appliedDate: '2026-07-07', rep: 'emp-0029' },
      { id: 'ord-7490', customer: 'Chen Wei', discountCode: 'CLEARANCE35', discountPct: '35.0%', avgPct: '12.4%', stdDev: '2.7σ', orderValue: '$320.00', discountAmt: '$112.00', appliedDate: '2026-07-06', rep: 'emp-0041' },
      { id: 'ord-7388', customer: 'Sofia Petrov', discountCode: 'FLASH25+MEMBER10', discountPct: '31.8%', avgPct: '12.4%', stdDev: '2.5σ', orderValue: '$580.00', discountAmt: '$184.44', appliedDate: '2026-07-05', rep: 'emp-0014' },
      { id: 'ord-7201', customer: 'Kwame Asante', discountCode: 'STAFF30', discountPct: '30.0%', avgPct: '12.4%', stdDev: '2.3σ', orderValue: '$210.00', discountAmt: '$63.00', appliedDate: '2026-07-04', rep: 'emp-0029' },
      { id: 'ord-7099', customer: 'Fatima Al-Hassan', discountCode: 'VIP25+NEW10', discountPct: '32.5%', avgPct: '12.4%', stdDev: '2.4σ', orderValue: '$760.00', discountAmt: '$247.00', appliedDate: '2026-07-03', rep: 'emp-0057' },
    ],
  },
  {
    id: 'rpt-returns',
    name: 'Return Fraud',
    queryRef: 'Query 3',
    viewRef: 'v_return_fraud',
    totalImpact: '$62,100',
    rowCount: 18,
    trend: 'down',
    trendPct: '-3.2%',
    riskLevel: 'critical',
    columns: ['Customer ID', 'Customer Name', 'Total Orders', 'Total Returns', 'Return Rate', 'Orders Value', 'Returned Value', 'Net Revenue', 'RFM Tier', 'Risk Score'],
    rows: [
      { id: 'cust-0041', name: 'Priya Nair', totalOrders: 24, totalReturns: 19, returnRate: '79.2%', ordersValue: '$12,440', returnedValue: '$9,852', netRevenue: '$2,588', rfmTier: 'At Risk', riskScore: 94 },
      { id: 'cust-0187', name: 'Dmitri Volkov', totalOrders: 17, totalReturns: 11, returnRate: '64.7%', ordersValue: '$8,920', returnedValue: '$5,771', netRevenue: '$3,149', rfmTier: 'At Risk', riskScore: 88 },
      { id: 'cust-0302', name: 'Amara Osei', totalOrders: 31, totalReturns: 17, returnRate: '54.8%', ordersValue: '$15,330', returnedValue: '$8,401', netRevenue: '$6,929', rfmTier: 'Potential', riskScore: 76 },
      { id: 'cust-0519', name: 'Lena Brandt', totalOrders: 14, totalReturns: 7, returnRate: '50.0%', ordersValue: '$6,780', returnedValue: '$3,390', netRevenue: '$3,390', rfmTier: 'Needs Attention', riskScore: 71 },
      { id: 'cust-0634', name: 'James Okafor', totalOrders: 22, totalReturns: 11, returnRate: '50.0%', ordersValue: '$9,210', returnedValue: '$4,605', netRevenue: '$4,605', rfmTier: 'Potential', riskScore: 63 },
      { id: 'cust-0712', name: 'Yuki Tanaka', totalOrders: 19, totalReturns: 10, returnRate: '52.6%', ordersValue: '$7,440', returnedValue: '$3,915', netRevenue: '$3,525', rfmTier: 'Needs Attention', riskScore: 67 },
    ],
  },
  {
    id: 'rpt-window-returns',
    name: 'Window-Edge Returns',
    queryRef: 'Query 4',
    viewRef: 'v_window_edge_returns',
    totalImpact: '$8,420',
    rowCount: 11,
    trend: 'flat',
    trendPct: '0.0%',
    riskLevel: 'medium',
    columns: ['Return ID', 'Customer', 'Order Date', 'Return Filed', 'Days Since Order', 'Items Returned', 'Return Value', 'Policy Limit', 'Flag Reason'],
    rows: [
      { id: 'ret-0441', customer: 'Mei Lin', orderDate: '2026-06-10', returnFiled: '2026-07-09', daysSince: 29, itemsReturned: 3, returnValue: '$284.00', policyLimit: '30 days', flagReason: 'Day 29 of 30' },
      { id: 'ret-0388', customer: 'Carlos Mendez', orderDate: '2026-06-11', returnFiled: '2026-07-09', daysSince: 28, itemsReturned: 1, returnValue: '$128.00', policyLimit: '30 days', flagReason: 'Day 28 of 30' },
      { id: 'ret-0312', customer: 'Ingrid Svensson', orderDate: '2026-06-09', returnFiled: '2026-07-08', daysSince: 29, itemsReturned: 2, returnValue: '$196.00', policyLimit: '30 days', flagReason: 'Day 29 of 30' },
      { id: 'ret-0271', customer: 'Tariq Hassan', orderDate: '2026-06-12', returnFiled: '2026-07-09', daysSince: 27, itemsReturned: 4, returnValue: '$441.00', policyLimit: '30 days', flagReason: 'Day 27 of 30' },
    ],
  },
  {
    id: 'rpt-shrinkage',
    name: 'Inventory Shrinkage',
    queryRef: 'Query 5',
    viewRef: 'v_shrinkage_report',
    totalImpact: '$79,440',
    rowCount: 43,
    trend: 'up',
    trendPct: '+12.7%',
    riskLevel: 'critical',
    columns: ['Product ID', 'SKU', 'Product Name', 'Expected Stock', 'Actual Stock', 'Delta Units', 'Cost Price', 'Total Shrinkage $', 'Location', 'Last Audit'],
    rows: [
      { id: 'prod-0118', sku: 'SKU-8821', product: 'Merino Pullover', expected: 240, actual: 198, delta: -42, costPrice: '$50.80', shrinkage: '-$2,133.60', location: 'Warehouse B', lastAudit: '2026-07-01' },
      { id: 'prod-0204', sku: 'SKU-5502', product: 'Denim Jacket (M)', expected: 180, actual: 151, delta: -29, costPrice: '$89.00', shrinkage: '-$2,581.00', location: 'Warehouse A', lastAudit: '2026-07-01' },
      { id: 'prod-0331', sku: 'SKU-3341', product: 'Canvas Tote Bag', expected: 520, actual: 471, delta: -49, costPrice: '$18.50', shrinkage: '-$906.50', location: 'Warehouse B', lastAudit: '2026-07-01' },
      { id: 'prod-0419', sku: 'SKU-7714', product: 'Running Shoes Sz10', expected: 160, actual: 128, delta: -32, costPrice: '$72.40', shrinkage: '-$2,316.80', location: 'Store 3', lastAudit: '2026-06-28' },
      { id: 'prod-0502', sku: 'SKU-9031', product: 'Wool Beanie', expected: 310, actual: 264, delta: -46, costPrice: '$14.50', shrinkage: '-$667.00', location: 'Warehouse A', lastAudit: '2026-07-02' },
      { id: 'prod-0618', sku: 'SKU-4410', product: 'Yoga Mat Pro', expected: 90, actual: 71, delta: -19, costPrice: '$41.00', shrinkage: '-$779.00', location: 'Store 1', lastAudit: '2026-06-30' },
    ],
  },
  {
    id: 'rpt-employee',
    name: 'Employee Anomalies',
    queryRef: 'Query 6',
    viewRef: 'v_employee_discount_anomalies',
    totalImpact: '$24,190',
    rowCount: 5,
    trend: 'flat',
    trendPct: '+0.8%',
    riskLevel: 'high',
    columns: ['Employee ID', 'Name', 'Dept', 'Avg Discount %', 'Team Avg %', 'Std Devs Above', 'Orders Processed', 'Total Discount Given', 'Anomaly Score', 'Status'],
    rows: [
      { id: 'emp-0029', name: 'Marcus Torres', dept: 'Sales Floor', avgDiscount: '28.4%', teamAvg: '11.2%', stdDevs: '3.1σ', ordersProcessed: 142, totalDiscount: '$8,841', anomalyScore: 91, status: 'Flagged' },
      { id: 'emp-0041', name: 'Nadia Okonkwo', dept: 'Online Sales', avgDiscount: '22.1%', teamAvg: '11.2%', stdDevs: '2.4σ', ordersProcessed: 98, totalDiscount: '$5,412', anomalyScore: 74, status: 'Under Review' },
      { id: 'emp-0014', name: 'Ryan Callahan', dept: 'Sales Floor', avgDiscount: '19.8%', teamAvg: '11.2%', stdDevs: '2.1σ', ordersProcessed: 201, totalDiscount: '$4,820', anomalyScore: 68, status: 'Under Review' },
      { id: 'emp-0057', name: 'Fatou Diallo', dept: 'Returns Desk', avgDiscount: '18.3%', teamAvg: '11.2%', stdDevs: '1.9σ', ordersProcessed: 77, totalDiscount: '$3,210', anomalyScore: 61, status: 'Monitoring' },
      { id: 'emp-0082', name: 'Jae-Won Park', dept: 'Online Sales', avgDiscount: '17.1%', teamAvg: '11.2%', stdDevs: '1.7σ', ordersProcessed: 154, totalDiscount: '$2,907', anomalyScore: 54, status: 'Monitoring' },
    ],
  },
  {
    id: 'rpt-churn',
    name: 'Late-Shipment Churn',
    queryRef: 'Query 7',
    viewRef: 'v_late_shipment_churn',
    totalImpact: '$31,200',
    rowCount: 67,
    trend: 'down',
    trendPct: '-6.1%',
    riskLevel: 'medium',
    columns: ['Shipment ID', 'Customer', 'Order Date', 'Expected Delivery', 'Actual Delivery', 'Days Late', 'Next Order Within 90d', 'Order Value', 'Churn Flag'],
    rows: [
      { id: 'ship-1041', customer: 'Elena Rossi', orderDate: '2026-06-01', expectedDelivery: '2026-06-05', actualDelivery: '2026-06-18', daysLate: 13, nextOrder: 'No', orderValue: '$284.00', churnFlag: 'Churned' },
      { id: 'ship-0988', customer: 'Omar Farouk', orderDate: '2026-06-03', expectedDelivery: '2026-06-07', actualDelivery: '2026-06-19', daysLate: 12, nextOrder: 'No', orderValue: '$412.00', churnFlag: 'Churned' },
      { id: 'ship-0921', customer: 'Hana Yamamoto', orderDate: '2026-06-05', expectedDelivery: '2026-06-09', actualDelivery: '2026-06-18', daysLate: 9, nextOrder: 'No', orderValue: '$196.00', churnFlag: 'Churned' },
      { id: 'ship-0874', customer: 'Luis Ramirez', orderDate: '2026-06-08', expectedDelivery: '2026-06-12', actualDelivery: '2026-06-21', daysLate: 9, nextOrder: 'Yes', orderValue: '$340.00', churnFlag: 'Retained' },
      { id: 'ship-0812', customer: 'Adaeze Chukwu', orderDate: '2026-06-10', expectedDelivery: '2026-06-14', actualDelivery: '2026-06-22', daysLate: 8, nextOrder: 'No', orderValue: '$524.00', churnFlag: 'Churned' },
    ],
  },
  {
    id: 'rpt-duplicate',
    name: 'Duplicate Orders',
    queryRef: 'Query 8',
    viewRef: 'v_duplicate_orders',
    totalImpact: '$4,810',
    rowCount: 9,
    trend: 'flat',
    trendPct: '-1.2%',
    riskLevel: 'medium',
    columns: ['Order ID 1', 'Order ID 2', 'Customer', 'SKU', 'Amount', 'Time Gap (min)', 'Payment Method', 'Status', 'Action Required'],
    rows: [
      { id: 'dup-001', orderId1: 'ord-7841', orderId2: 'ord-7842', customer: 'cust-0302', sku: 'SKU-3341', amount: '$284.00', timeGap: 22, paymentMethod: 'Credit Card', status: 'Both Fulfilled', action: 'Refund ord-7842' },
      { id: 'dup-002', orderId1: 'ord-7612', orderId2: 'ord-7614', customer: 'cust-0041', sku: 'SKU-8821', amount: '$192.00', timeGap: 8, paymentMethod: 'PayPal', status: 'Both Fulfilled', action: 'Refund ord-7614' },
      { id: 'dup-003', orderId1: 'ord-7490', orderId2: 'ord-7491', customer: 'cust-0187', sku: 'SKU-5502', amount: '$649.00', timeGap: 34, paymentMethod: 'Credit Card', status: 'Under Review', action: 'Pending' },
    ],
  },
  {
    id: 'rpt-payment',
    name: 'Payment Risk',
    queryRef: 'Query 9',
    viewRef: 'v_payment_risk',
    totalImpact: '$14,320',
    rowCount: 6,
    trend: 'up',
    trendPct: '+4.8%',
    riskLevel: 'high',
    columns: ['Payment Method', 'Total Transactions', 'Failures', 'Chargebacks', 'Failure Rate', 'Chargeback Rate', 'Total Exposure', 'Avg Transaction', 'Risk Level'],
    rows: [
      { id: 'pay-crypto', method: 'Crypto Wallet', totalTx: 88, failures: 12, chargebacks: 8, failureRate: '13.6%', chargebackRate: '9.1%', exposure: '$4,210', avgTx: '$148.00', riskLevel: 'Critical' },
      { id: 'pay-bnpl', method: 'Buy Now Pay Later', totalTx: 241, failures: 18, chargebacks: 14, failureRate: '7.5%', chargebackRate: '5.8%', exposure: '$3,840', avgTx: '$212.00', riskLevel: 'High' },
      { id: 'pay-paypal', method: 'PayPal', totalTx: 1240, failures: 44, chargebacks: 22, failureRate: '3.5%', chargebackRate: '1.8%', exposure: '$2,890', avgTx: '$84.00', riskLevel: 'Medium' },
      { id: 'pay-debit', method: 'Debit Card', totalTx: 2841, failures: 31, chargebacks: 8, failureRate: '1.1%', chargebackRate: '0.3%', exposure: '$1,240', avgTx: '$91.00', riskLevel: 'Low' },
      { id: 'pay-credit', method: 'Credit Card', totalTx: 4120, failures: 28, chargebacks: 11, failureRate: '0.7%', chargebackRate: '0.3%', exposure: '$2,140', avgTx: '$124.00', riskLevel: 'Low' },
    ],
  },
];

function TrendIndicator({ trend, pct }: { trend: 'up' | 'down' | 'flat'; pct: string }) {
  if (trend === 'up') return (
    <span className="flex items-center gap-1 text-xs font-medium text-primary tabular-nums">
      <TrendingUp size={12} /> {pct}
    </span>
  );
  if (trend === 'down') return (
    <span className="flex items-center gap-1 text-xs font-medium text-positive tabular-nums">
      <TrendingDown size={12} /> {pct}
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground tabular-nums">
      <Minus size={12} /> {pct}
    </span>
  );
}

function ReportSection({ report }: { report: ReportCategory }) {
  const [expanded, setExpanded] = useState(false);

  const handleExport = () => {
    toast.success(`Exporting ${report.name} report as CSV`);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          {expanded ? <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{report.name}</span>
              <RiskBadge level={report.riskLevel} size="sm" />
              <span className="text-xs font-mono text-muted-foreground">{report.queryRef} · {report.viewRef}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{report.rowCount} flagged records</p>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-4 flex-shrink-0">
          <TrendIndicator trend={report.trend} pct={report.trendPct} />
          <span className="text-sm font-bold text-primary tabular-nums font-mono">{report.totalImpact}</span>
          <button
            onClick={(e) => { e.stopPropagation(); handleExport(); }}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            title={`Export ${report.name} as CSV`}
          >
            <Download size={14} />
          </button>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  {report.columns.map((col) => (
                    <th key={`col-${report.id}-${col}`} className="px-3 py-2.5 text-left font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row, rowIdx) => (
                  <tr key={row.id} className={`border-b border-border/40 hover:bg-muted/20 transition-colors ${rowIdx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    {Object.entries(row).filter(([k]) => k !== 'id').map(([key, val]) => (
                      <td key={`cell-${row.id}-${key}`} className="px-3 py-2.5 text-foreground whitespace-nowrap font-mono">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/10 border-t border-border/50">
            <span className="text-xs text-muted-foreground">Showing {report.rows.length} of {report.rowCount} records</span>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Download size={12} /> Export full report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RiskReportsScreen() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const totalLeakage = '$284,719';

  const displayedReports = activeCategory
    ? reportCategories.filter((r) => r.id === activeCategory)
    : reportCategories;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Risk Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            13 tiered risk queries — total exposure{' '}
            <span className="font-mono font-bold text-primary">{totalLeakage}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors">
            <Filter size={13} />
            Filters
          </button>
          <button
            onClick={() => toast.success('Exporting all 13 risk reports as ZIP')}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
          >
            <Download size={13} />
            Export All
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3">
        {[
          { label: 'Total Exposure', value: '$284,719', sub: 'All categories', color: 'text-primary' },
          { label: 'Critical Reports', value: '3', sub: 'Require action', color: 'text-primary' },
          { label: 'High Risk Reports', value: '3', sub: 'Monitor closely', color: 'text-orange-400' },
          { label: 'Records Flagged', value: '329', sub: 'Across all queries', color: 'text-warning' },
        ].map((s) => (
          <div key={`summary-${s.label}`} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-bold tabular-nums mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            activeCategory === null
              ? 'bg-primary/10 text-primary border-primary/30' :'bg-muted text-muted-foreground border-border hover:text-foreground'
          }`}
        >
          All Reports ({reportCategories.length})
        </button>
        {reportCategories.map((r) => (
          <button
            key={`chip-${r.id}`}
            onClick={() => setActiveCategory(activeCategory === r.id ? null : r.id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === r.id
                ? 'bg-primary/10 text-primary border-primary/30' :'bg-muted text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Report sections */}
      <div className="space-y-2">
        {displayedReports.map((report) => (
          <ReportSection key={report.id} report={report} />
        ))}
      </div>

      {/* Query 10–13 stubs */}
      {!activeCategory && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3">
          {[
            { id: 'rpt-supplier-trend', name: 'Supplier Defect Trend', queryRef: 'Query 10', viewRef: 'v_supplier_trend', impact: '$38,889', level: 'high' as const, note: 'Window functions — MoM rise per supplier' },
            { id: 'rpt-rfm', name: 'RFM Churn Scoring', queryRef: 'Query 11', viewRef: 'v_rfm_scores', impact: '$91,200', level: 'high' as const, note: 'Recency/Frequency/Monetary tiering' },
            { id: 'rpt-composite', name: 'Composite Risk Score', queryRef: 'Query 12', viewRef: 'v_high_risk_customers', impact: '$284,719', level: 'critical' as const, note: 'One number combining all flags per customer' },
            { id: 'rpt-total', name: 'Total Leaked Revenue', queryRef: 'Query 13', viewRef: 'generate_risk_report()', impact: '$284,719', level: 'critical' as const, note: 'Single headline figure across all categories' },
          ].map((stub) => (
            <div key={stub.id} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileBarChart2 size={16} className="text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{stub.name}</span>
                    <RiskBadge level={stub.level} size="sm" />
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">{stub.queryRef} · {stub.viewRef}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stub.note}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-primary tabular-nums font-mono flex-shrink-0">{stub.impact}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}