import type { Priority, WorkflowStatus } from './common';
import type { Person } from './org';

export type IncidentSeverity = 'sev1' | 'sev2' | 'sev3' | 'sev4';

export type IncidentStatus =
  | Extract<WorkflowStatus, 'inProgress' | 'blocked' | 'completed' | 'cancelled'>
  | 'investigating'
  | 'mitigated'
  | 'resolved'
  | 'closed';

export type PostmortemStatus = 'notRequired' | 'pending' | 'inProgress' | 'published' | 'overdue';

export type CorrectiveAction = {
  id: string;
  description: string;
  owner: Person;
  dueDate: string;
  status: WorkflowStatus;
  overdue: boolean;
};

export type Incident = {
  id: string;
  severity: IncidentSeverity;
  programId: string;
  title: string;
  description: string;
  startTime: string;
  endTime?: string;
  mttrMinutes?: number;
  status: IncidentStatus;
  rootCause?: string;
  postmortemStatus: PostmortemStatus;
  correctiveActions: CorrectiveAction[];
  overdueActions: number;
  owner: Person;
  priority: Priority;
  impactedServices: string[];
};
