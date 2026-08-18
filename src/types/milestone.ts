import type { Priority, RagStatus, WorkflowStatus } from './common';
import type { Person } from './org';

export type MilestoneStatus = WorkflowStatus | 'missed' | 'slipped';

export type Milestone = {
  id: string;
  programId: string;
  name: string;
  description: string;
  owner: Person;
  plannedDate: string;
  forecastDate?: string;
  actualDate?: string;
  percentComplete: number;
  status: MilestoneStatus;
  rag: RagStatus;
  priority: Priority;
  deliverables: string[];
  dependencies: string[];
  quarter: string;
};
