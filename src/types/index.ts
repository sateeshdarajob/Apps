import type { ReactNode } from 'react';

/** Shared domain types for the TPM Control Tower. Keep UI free of inline business shapes. */

export type RagStatus = 'green' | 'amber' | 'red' | 'grey';

export type ProgramHealth = RagStatus;

export type ProgramPhase = 'discovery' | 'planning' | 'execution' | 'stabilization' | 'closed';

export type OrgUnit = {
  id: string;
  name: string;
};

export type Portfolio = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  orgUnitId: string;
};

export type Product = {
  id: string;
  name: string;
  portfolioId: string;
};

export type Person = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials?: string;
};

export type Program = {
  id: string;
  name: string;
  code: string;
  description: string;
  phase: ProgramPhase;
  health: ProgramHealth;
  ownerId: string;
  orgUnitId: string;
  portfolioId: string;
  productId: string;
  teamId: string;
  startDate: string;
  targetEndDate: string;
  percentComplete: number;
  ragComment?: string;
};

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export type Risk = {
  id: string;
  programId: string;
  title: string;
  severity: RiskSeverity;
  status: 'open' | 'mitigating' | 'accepted' | 'closed';
  ownerId: string;
  dueDate: string;
};

export type Dependency = {
  id: string;
  programId: string;
  dependsOnProgramId: string;
  description: string;
  status: RagStatus;
  targetDate: string;
};

export type KpiTrend = 'up' | 'down' | 'flat';

export type KpiMetric = {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  delta?: number;
  trend?: KpiTrend;
  status?: RagStatus;
  helperText?: string;
};

export type ChartSeriesPoint = {
  label: string;
  value: number;
};

export type NamedSeries = {
  name: string;
  data: ChartSeriesPoint[];
};

export type DateRangeValue = '30d' | '90d' | '6m' | '12m' | 'ytd';

export type AutoRefreshInterval = 'manual' | '5m' | '15m' | '30m' | '1h';

/**
 * Shared global filter state consumed by every dashboard route.
 * Persist shape here so pages never redefine filter fields locally.
 */
export type GlobalFilters = {
  portfolioId: string | 'all';
  programId: string | 'all';
  quarter: string | 'all';
  teamId: string | 'all';
  productId: string | 'all';
  ragStatus: RagStatus | 'all';
  dateRange: DateRangeValue;
};

export type FilterOption = {
  id: string;
  label: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  path: string;
  icon: string;
  section?: 'primary' | 'secondary';
  children?: NavigationItem[];
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type TableColumn<T> = {
  id: keyof T | string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  render?: (row: T) => ReactNode;
};
