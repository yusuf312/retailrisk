import React from 'react';

type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'clear';

interface RiskBadgeProps {
  level: RiskLevel;
  label?: string;
  size?: 'sm' | 'md';
}

const levelConfig: Record<RiskLevel, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'risk-critical' },
  high:     { label: 'High',     className: 'risk-high' },
  medium:   { label: 'Medium',   className: 'risk-medium' },
  low:      { label: 'Low',      className: 'risk-low' },
  clear:    { label: 'Clear',    className: 'risk-clear' },
};

export default function RiskBadge({ level, label, size = 'md' }: RiskBadgeProps) {
  const config = levelConfig[level];
  const displayLabel = label ?? config.label;
  return (
    <span
      className={`
        inline-flex items-center rounded border font-medium tabular-nums
        ${size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'}
        ${config.className}
      `}
    >
      {displayLabel}
    </span>
  );
}