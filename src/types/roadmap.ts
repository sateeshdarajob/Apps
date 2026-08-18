import type { Priority, RagStatus, WorkflowStatus } from './common';
import type { Person } from './org';

export type RoadmapItemType =
  'epic' | 'initiative' | 'feature' | 'enabler' | 'milestone' | 'program';

export type RoadmapDeliveryState = 'completed' | 'inProgress' | 'atRisk' | 'delayed';

export type RoadmapItem = {
  id: string;
  programId: string;
  title: string;
  description: string;
  type: RoadmapItemType;
  /** Executive workstream label shown on the Gantt (e.g. Platform, Experience). */
  workstream: string;
  quarter: string;
  startDate: string;
  endDate: string;
  status: WorkflowStatus;
  rag: RagStatus;
  priority: Priority;
  owner: Person;
  teamId: string;
  productId?: string;
  percentComplete: number;
  parentId?: string;
  dependsOn: string[];
  milestoneIds?: string[];
};
