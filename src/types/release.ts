import type { RagStatus } from './common';
import type { Person } from './org';

export type ReleaseStatus =
  | 'planned'
  | 'inDevelopment'
  | 'codeComplete'
  | 'inQa'
  | 'ready'
  | 'go'
  | 'noGo'
  | 'released'
  | 'rolledBack';

export type ReadinessFlag = 'notStarted' | 'inProgress' | 'complete' | 'waived' | 'blocked';

export type GoNoGoDecision = 'pending' | 'go' | 'noGo' | 'conditionalGo';

export type Release = {
  id: string;
  version: string;
  programId: string;
  name: string;
  plannedDate: string;
  actualDate?: string;
  status: ReleaseStatus;
  codeComplete: ReadinessFlag;
  qaComplete: ReadinessFlag;
  securityComplete: ReadinessFlag;
  performanceComplete: ReadinessFlag;
  documentationComplete: ReadinessFlag;
  businessReadiness: ReadinessFlag;
  readinessScore: number;
  goNoGo: GoNoGoDecision;
  releaseManager: Person;
  rag: RagStatus;
  notes?: string;
};
