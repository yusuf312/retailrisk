import React from 'react';

type StatusType = 'flagged' | 'under_review' | 'escalated' | 'resolved' | 'cleared';

interface StatusBadgeProps {
  status: StatusType;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  flagged:      { label: 'Flagged',       className: 'bg-negative-bg text-negative border-negative/40' },
  under_review: { label: 'Under Review',  className: 'bg-warning-bg text-warning border-warning/40' },
  escalated:    { label: 'Escalated',     className: 'bg-orange-950 text-orange-400 border-orange-400/40' },
  resolved:     { label: 'Resolved',      className: 'bg-positive-bg text-positive border-positive/40' },
  cleared:      { label: 'Cleared',       className: 'bg-muted text-muted-foreground border-border' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border ${config.className}`}>
      {config.label}
    </span>
  );
}