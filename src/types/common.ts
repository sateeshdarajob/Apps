/** Shared primitive enums and value types used across domain entities. */

export type RagStatus = 'green' | 'amber' | 'red' | 'grey';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type ImpactLevel = 'critical' | 'high' | 'medium' | 'low';

export type Probability = 'almostCertain' | 'likely' | 'possible' | 'unlikely' | 'rare';

export type WorkflowStatus =
  'notStarted' | 'inProgress' | 'blocked' | 'atRisk' | 'completed' | 'cancelled' | 'deferred';

export type ProgramStatus =
  'proposed' | 'approved' | 'discovery' | 'planning' | 'execution' | 'stabilization' | 'closed';

export type Money = {
  amount: number;
  currency: string;
};

export type DateRangeValue = '30d' | '90d' | '6m' | '12m' | 'ytd';

export type AutoRefreshInterval = 'manual' | '5m' | '15m' | '30m' | '1h';
