import type { ImpactLevel, Priority, WorkflowStatus } from './common';
import type { Person, Team } from './org';

export type DependencyStatus = Extract<
  WorkflowStatus,
  'notStarted' | 'inProgress' | 'blocked' | 'atRisk' | 'completed' | 'cancelled'
>;

export type Dependency = {
  id: string;
  programId: string;
  dependsOnProgramId?: string;
  description: string;
  owner: Person;
  blockingTeam: Team;
  dueDate: string;
  impact: ImpactLevel;
  priority: Priority;
  status: DependencyStatus;
  mitigation: string;
  escalationOwner: Person;
  ageInDays: number;
  isBlocker: boolean;
  createdAt: string;
};
