import type { ImpactLevel, Probability, Priority, WorkflowStatus } from './common';
import type { Person } from './org';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export type RiskStatus =
  | Extract<
      WorkflowStatus,
      'notStarted' | 'inProgress' | 'blocked' | 'atRisk' | 'completed' | 'cancelled' | 'deferred'
    >
  | 'open'
  | 'mitigating'
  | 'accepted'
  | 'closed'
  | 'watching';

export type EscalationLevel = 'none' | 'manager' | 'director' | 'vp' | 'executive';

export type Risk = {
  id: string;
  programId: string;
  title: string;
  description: string;
  probability: Probability;
  impact: ImpactLevel;
  severity: RiskSeverity;
  owner: Person;
  mitigation: string;
  targetResolutionDate: string;
  escalationLevel: EscalationLevel;
  status: RiskStatus;
  priority: Priority;
  residualRisk?: RiskSeverity;
  identifiedDate: string;
  ageInDays: number;
};
