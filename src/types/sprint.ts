import type { RagStatus, WorkflowStatus } from './common';
import type { Person } from './org';

export type Sprint = {
  id: string;
  programId: string;
  teamId: string;
  name: string;
  number: number;
  goal: string;
  startDate: string;
  endDate: string;
  status: Extract<WorkflowStatus, 'notStarted' | 'inProgress' | 'completed' | 'cancelled'>;
  committedPoints: number;
  completedPoints: number;
  carriedOverPoints: number;
  velocity: number;
  rag: RagStatus;
  scrumMaster: Person;
  defectCount: number;
  percentComplete: number;
};
