'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Check, ChevronDown, ChevronRight, Database, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  explanation?: string;
  timestamp: string;
}

const schemaRef = [
  { id: 'schema-customers', table: 'customers', cols: ['customer_id', 'name', 'email', 'is_active', 'created_at', 'rfm_score', 'rfm_tier'], note: 'ON DELETE RESTRICT on orders' },
  { id: 'schema-orders', table: 'orders', cols: ['order_id', 'customer_id', 'employee_id', 'order_date', 'total_amount', 'status'], note: 'Links to order_items, payments, shipments' },
  { id: 'schema-order-items', table: 'order_items', cols: ['item_id', 'order_id', 'product_id', 'qty', 'sale_price', 'cost_price'], note: 'sale_price stored per line item — gap from list price is a risk signal' },
  { id: 'schema-returns', table: 'returns', cols: ['return_id', 'item_id', 'customer_id', 'return_date', 'reason', 'refund_amount', 'approved'], note: 'Linked to order_items not orders' },
  { id: 'schema-discounts', table: 'discounts_applied', cols: ['discount_id', 'order_id', 'code', 'discount_pct', 'applied_by'], note: 'Multiple per order — stacking detection uses GROUP BY + stddev' },
  { id: 'schema-inventory', table: 'inventory_logs', cols: ['log_id', 'product_id', 'log_type', 'quantity', 'location', 'logged_at'], note: 'Expected vs actual delta = shrinkage' },
  { id: 'schema-employees', table: 'employees', cols: ['employee_id', 'name', 'department', 'hire_date', 'is_active'], note: 'Linked to orders via employee_id' },
  { id: 'schema-suppliers', table: 'suppliers', cols: ['supplier_id', 'name', 'contact_email', 'country', 'defect_rate_pct'], note: 'Linked to products' },
  { id: 'schema-payments', table: 'payments', cols: ['payment_id', 'order_id', 'method', 'status', 'amount', 'chargeback_flag'], note: 'status: completed | failed | chargeback' },
  { id: 'schema-shipments', table: 'shipments', cols: ['shipment_id', 'order_id', 'carrier', 'expected_date', 'actual_date', 'days_late'], note: 'Late deliveries correlated to churn in Query 7' },
];

const views = [
  { id: 'view-pricing', name: 'v_pricing_errors', desc: 'Items where sale_price < cost_price, with per-unit and total loss' },
  { id: 'view-shrinkage', name: 'v_shrinkage_report', desc: 'Expected vs actual inventory delta costed at purchase price' },
  { id: 'view-employee', name: 'v_employee_discount_anomalies', desc: 'Reps whose avg discount is >2σ above department mean' },
  { id: 'view-highrisk', name: 'v_high_risk_customers', desc: 'Composite risk score combining all 12 sub-scores per customer' },
  { id: 'view-rfm', name: 'v_rfm_scores', desc: 'Recency/Frequency/Monetary tiers computed in pure SQL' },
  { id: 'view-supplier', name: 'v_supplier_trend', desc: 'Month-over-month return rate per supplier using window functions' },
  { id: 'fn-report', name: 'generate_risk_report()', desc: 'Function: returns headline leaked revenue across all 13 categories' },
];

const suggestedPrompts = [
  { id: 'prompt-top-leak', label: 'Which customers caused the most revenue leakage last month?', category: 'Customers' },
  { id: 'prompt-below-cost', label: 'Show me all products sold below cost in the last 7 days', category: 'Pricing' },
  { id: 'prompt-supplier-defect', label: 'Which supplier has the highest rising defect rate this quarter?', category: 'Suppliers' },
  { id: 'prompt-emp-discount', label: 'Flag employees discounting more than 2 standard deviations above average', category: 'Employees' },
  { id: 'prompt-total-leak', label: 'What is our total leaked revenue broken down by category?', category: 'Summary' },
];

const mockResponses: Record<string, { sql: string; explanation: string }> = {
  'Which customers caused the most revenue leakage last month?': {
    sql: `-- Query uses v_high_risk_customers + order_items to compute per-customer leakage
SELECT
  c.customer_id,
  c.name,
  c.rfm_tier,
  SUM(
    CASE WHEN oi.sale_price < oi.cost_price
      THEN (oi.cost_price - oi.sale_price) * oi.qty
      ELSE 0
    END
  ) AS pricing_leakage,
  COUNT(DISTINCT r.return_id) AS return_count,
  SUM(r.refund_amount) AS return_exposure,
  v.composite_risk_score
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
LEFT JOIN returns r ON r.item_id = oi.item_id
JOIN v_high_risk_customers v ON v.customer_id = c.customer_id
WHERE o.order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  AND o.order_date < DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.customer_id, c.name, c.rfm_tier, v.composite_risk_score
ORDER BY (pricing_leakage + return_exposure) DESC
LIMIT 20;`,
    explanation: 'This query joins customers → orders → order_items to find pricing leakage (sale below cost) and adds return exposure per customer. It filters to the previous calendar month using DATE_TRUNC and pulls the composite risk score from the v_high_risk_customers view. Results are sorted by total dollar exposure descending.',
  },
  'Show me all products sold below cost in the last 7 days': {
    sql: `-- Equivalent to v_pricing_errors filtered to recent window
SELECT
  p.product_id,
  p.sku,
  p.name AS product_name,
  oi.sale_price,
  oi.cost_price,
  (oi.cost_price - oi.sale_price) AS loss_per_unit,
  oi.qty,
  (oi.cost_price - oi.sale_price) * oi.qty AS total_loss,
  o.order_date,
  e.name AS processed_by
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
JOIN orders o ON o.order_id = oi.order_id
JOIN employees e ON e.employee_id = o.employee_id
WHERE oi.sale_price < oi.cost_price
  AND o.order_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY total_loss ASC;`,
    explanation: 'Filters order_items where sale_price is below cost_price (the key design decision in this schema — cost_price is not constrained to be less than sale_price, so this state can exist and be detected). Joins to products for SKU/name, orders for date, and employees to show which rep processed the sale. Sorted by total_loss ascending (most negative = biggest loss first).',
  },
  'Which supplier has the highest rising defect rate this quarter?': {
    sql: `-- Uses v_supplier_trend which applies LAG() window function
SELECT
  s.supplier_id,
  s.name AS supplier_name,
  s.country,
  DATE_TRUNC('month', r.return_date) AS month,
  COUNT(r.return_id) AS returns_this_month,
  LAG(COUNT(r.return_id)) OVER (
    PARTITION BY s.supplier_id
    ORDER BY DATE_TRUNC('month', r.return_date)
  ) AS returns_prev_month,
  ROUND(
    (COUNT(r.return_id)::numeric /
     NULLIF(LAG(COUNT(r.return_id)) OVER (
       PARTITION BY s.supplier_id
       ORDER BY DATE_TRUNC('month', r.return_date)
     ), 0) - 1) * 100, 2
  ) AS mom_change_pct
FROM suppliers s
JOIN products p ON p.supplier_id = s.supplier_id
JOIN order_items oi ON oi.product_id = p.product_id
JOIN returns r ON r.item_id = oi.item_id
WHERE r.return_date >= DATE_TRUNC('quarter', CURRENT_DATE)
GROUP BY s.supplier_id, s.name, s.country, DATE_TRUNC('month', r.return_date)
ORDER BY mom_change_pct DESC NULLS LAST
LIMIT 10;`,
    explanation: 'This is Query 10 from risk_queries.sql. It uses LAG() as a window function partitioned by supplier_id to compare this month\'s return count to last month\'s, computing a month-over-month change percentage. A positive mom_change_pct means returns are rising — the supplier at the top of this list is your highest escalating defect risk.',
  },
};

function SQLBlock({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('SQL copied to clipboard');
  };
  return (
    <div className="mt-3 sql-block overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/20">
        <span className="text-xs font-medium text-muted-foreground font-mono">SQL Query</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check size={12} className="text-positive" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs leading-relaxed text-foreground whitespace-pre">
        <code>{sql}</code>
      </pre>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUser ? 'bg-primary/20' : 'bg-muted'}`}>
        {isUser ? <User size={14} className="text-primary" /> : <Bot size={14} className="text-muted-foreground" />}
      </div>
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end flex flex-col' : ''}`}>
        <div className={`rounded-lg px-3 py-2.5 ${isUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted border border-border'}`}>
          <p className="text-sm text-foreground leading-relaxed">{message.content}</p>
          {message.sql && <SQLBlock sql={message.sql} />}
          {message.explanation && (
            <div className="mt-3 p-2.5 rounded-md bg-info-bg border border-info/20">
              <p className="text-xs font-medium text-info mb-1">Plain-English Explanation</p>
              <p className="text-xs text-foreground leading-relaxed">{message.explanation}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1">{message.timestamp}</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-muted-foreground" />
      </div>
      <div className="bg-muted border border-border rounded-lg px-4 py-3">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map(i => (
            <div
              key={`dot-${i}`}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
              style={{ animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: 'Hello! I\'m grounded in the RetailRisk schema — I know all 13 tables, 6 risk views, and the generate_risk_report() function. Ask me to explain what a risk score means, or describe a business question and I\'ll translate it into SQL against this exact schema.',
      timestamp: '08:29 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [schemaExpanded, setSchemaExpanded] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Backend integration point: POST /api/ai/chat with { message: text, schema_context: true }
    await new Promise(r => setTimeout(r, 1400 + Math.random() * 800));

    const matched = mockResponses[text];
    const assistantMsg: Message = {
      id: `msg-assistant-${Date.now()}`,
      role: 'assistant',
      content: matched
        ? `Here's the SQL query for: "${text}"`
        : `I can help with that. Based on the RetailRisk schema, here's how I'd approach "${text}" — this would involve querying the relevant risk views and joining across the core entity tables. For a precise SQL translation, try one of the suggested prompts or rephrase with a specific time window and metric.`,
      sql: matched?.sql,
      explanation: matched?.explanation,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setIsTyping(false);
    setMessages(prev => [...prev, assistantMsg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleSchema = (id: string) => {
    setSchemaExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fade-in h-[calc(100vh-8rem)]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">AI Assistant</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Schema-grounded SQL translator — explain risk concepts or convert plain English to queries
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
            <Sparkles size={12} className="text-warning" />
            Grounded in RetailRisk schema
          </div>
        </div>

        <div className="flex gap-4 flex-1 min-h-0">
          {/* Chat panel */}
          <div className="flex-1 flex flex-col bg-card border border-border rounded-lg overflow-hidden min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts */}
            <div className="px-4 py-2 border-t border-border bg-muted/10">
              <p className="text-xs text-muted-foreground mb-2">Suggested queries</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => sendMessage(p.label)}
                    disabled={isTyping}
                    className="text-xs px-2.5 py-1.5 rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-border">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about a risk category, or describe a business question..."
                className="flex-1 px-3 py-2.5 text-sm bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Send size={15} />
              </button>
            </form>
          </div>

          {/* Schema reference panel */}
          <div className="hidden xl:flex xl:w-72 2xl:w-80 flex-col bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Schema Reference</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">12 tables · 6 views · 1 function</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">Tables</p>
              {schemaRef.map(t => (
                <div key={t.id} className="rounded-md overflow-hidden">
                  <button
                    onClick={() => toggleSchema(t.id)}
                    className="w-full flex items-center gap-2 px-2 py-2 text-left hover:bg-muted transition-colors"
                  >
                    {schemaExpanded[t.id] ? <ChevronDown size={12} className="text-muted-foreground flex-shrink-0" /> : <ChevronRight size={12} className="text-muted-foreground flex-shrink-0" />}
                    <span className="text-xs font-mono font-medium text-foreground">{t.table}</span>
                  </button>
                  {schemaExpanded[t.id] && (
                    <div className="px-3 pb-2 bg-muted/20 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mt-2 mb-1.5 leading-relaxed">{t.note}</p>
                      <div className="flex flex-wrap gap-1">
                        {t.cols.map(col => (
                          <span key={`col-ref-${t.id}-${col}`} className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mt-4 mb-2">Views & Functions</p>
              {views.map(v => (
                <div key={v.id} className="px-2 py-2 rounded-md hover:bg-muted transition-colors">
                  <p className="text-xs font-mono font-medium text-primary">{v.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}