import type { Priority, RagStatus, WorkflowStatus } from './common';
import type { Person } from './org';

export type RoadmapItemType = 'epic' | 'initiative' | 'feature' | 'enabler' | 'milestone';

export type RoadmapItem = {
  id: string;
  programId: string;
  title: string;
  description: string;
  type: RoadmapItemType;
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
};
