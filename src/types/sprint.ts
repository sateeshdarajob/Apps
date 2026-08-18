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
  blockedItems: number;
  velocity: number;
  rag: RagStatus;
  scrumMaster: Person;
  defectCount: number;
  escapedDefects: number;
  percentComplete: number;
};

/** Period-level delivery metrics used for planned vs actual and scope charts. */
export type DeliveryPeriodMetric = {
  id: string;
  label: string;
  programId: string;
  planned: number;
  actual: number;
  onTimePct: number;
  originalScope: number;
  addedScope: number;
  removedScope: number;
};

export type WorkItemAgingBucket = {
  id: string;
  programId: string;
  teamId: string;
  bucket: '0-7' | '8-14' | '15-30' | '30+';
  count: number;
};
