import type { ReactNode } from 'react';

/** Shared domain types for the TPM Control Tower. Keep UI free of inline business shapes. */

export type RagStatus = 'green' | 'amber' | 'red' | 'grey';

export type ProgramHealth = RagStatus;

export type ProgramPhase = 'discovery' | 'planning' | 'execution' | 'stabilization' | 'closed';

export type OrgUnit = {
  id: string;
  name: string;
};

export type Person = {
  id: string;
  name: string;
  email: string;
  role: string;
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

export type GlobalFilters = {
  orgUnitId: string | 'all';
  programId: string | 'all';
  dateRange: '30d' | '90d' | '6m' | '12m' | 'ytd';
};

export type NavigationItem = {
  id: string;
  label: string;
  path: string;
  icon: string;
  children?: NavigationItem[];
};

export type TableColumn<T> = {
  id: keyof T | string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  render?: (row: T) => ReactNode;
};
