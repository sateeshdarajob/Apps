import type { ImpactLevel, Priority } from './common';
import type { Person } from './org';

export type DecisionStatus =
  'proposed' | 'inReview' | 'approved' | 'rejected' | 'deferred' | 'implemented';

export type Decision = {
  id: string;
  title: string;
  description: string;
  programId?: string;
  owner: Person;
  dueDate: string;
  status: DecisionStatus;
  ageInDays: number;
  impact: ImpactLevel;
  escalationRequired: boolean;
  priority: Priority;
  decisionDate?: string;
  outcome?: string;
  stakeholders: Person[];
};
