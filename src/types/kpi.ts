import type { RagStatus } from './common';

export type KpiTrend = 'up' | 'down' | 'flat';

export type KpiCategory =
  'delivery' | 'quality' | 'risk' | 'capacity' | 'financial' | 'outcome' | 'portfolio';

/** Portfolio / program KPI used by dashboard cards and metrics views. */
export type Kpi = {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  delta?: number;
  trend?: KpiTrend;
  status?: RagStatus;
  helperText?: string;
  category: KpiCategory;
  programId?: string;
  portfolioId?: string;
  teamId?: string;
  quarter?: string;
  asOfDate: string;
};

/** @deprecated Prefer `Kpi`. Kept as a type alias so existing UI imports remain valid. */
export type KpiMetric = Kpi;
