/**
 * Centralized TPM Control Tower domain model.
 * Import from `@/types` — do not redefine entity shapes in pages or components.
 */

export type {
  RagStatus,
  Priority,
  ImpactLevel,
  Probability,
  WorkflowStatus,
  ProgramStatus,
  Money,
  DateRangeValue,
  AutoRefreshInterval,
} from './common';

export type {
  OrgUnit,
  Portfolio,
  Product,
  Person,
  Team,
  FilterOption,
  CurrentUser,
  AppNotification,
} from './org';

export type { Milestone, MilestoneStatus } from './milestone';
export type { Dependency, DependencyStatus } from './dependency';
export type { Risk, RiskSeverity, RiskStatus, EscalationLevel } from './risk';
export type { Release, ReleaseStatus, ReadinessFlag, GoNoGoDecision } from './release';
export type {
  Incident,
  IncidentSeverity,
  IncidentStatus,
  PostmortemStatus,
  CorrectiveAction,
} from './incident';
export type { Decision, DecisionStatus } from './decision';
export type { BusinessOutcome, OutcomeStatus } from './businessOutcome';
export type { Kpi, KpiMetric, KpiTrend, KpiCategory } from './kpi';
export type { RoadmapItem, RoadmapItemType } from './roadmap';
export type { Sprint, DeliveryPeriodMetric, WorkItemAgingBucket } from './sprint';
export type { Defect, DefectSeverity, DefectStatus } from './defect';
export type { Capacity } from './capacity';
export type { Program } from './program';
export type { GlobalFilters } from './filters';
export type { NavigationItem, ChartSeriesPoint, NamedSeries, TableColumn } from './ui';

/** @deprecated Use Program.rag / Program.status instead. */
export type ProgramHealth = import('./common').RagStatus;
export type ProgramPhase = import('./common').ProgramStatus;
