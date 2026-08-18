import type { RagStatus } from '@/types';

export const RAG_LABELS: Record<RagStatus, string> = {
  green: 'On Track',
  amber: 'At Risk',
  red: 'Off Track',
  grey: 'Not Set',
};

export const DATE_RANGE_OPTIONS = [
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '6m', label: 'Last 6 months' },
  { value: '12m', label: 'Last 12 months' },
  { value: 'ytd', label: 'Year to date' },
] as const;

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDelta(delta: number): string {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta}`;
}

export function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
