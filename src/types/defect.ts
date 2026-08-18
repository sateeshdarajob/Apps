import type { ImpactLevel, Priority } from './common';
import type { Person } from './org';

export type DefectSeverity = 'blocker' | 'critical' | 'major' | 'minor' | 'trivial';

export type DefectStatus =
  'open' | 'inProgress' | 'fixed' | 'verified' | 'closed' | 'deferred' | 'wontFix';

export type Defect = {
  id: string;
  programId: string;
  releaseId?: string;
  sprintId?: string;
  title: string;
  description: string;
  severity: DefectSeverity;
  priority: Priority;
  status: DefectStatus;
  owner: Person;
  reporter: Person;
  foundDate: string;
  targetFixDate?: string;
  resolvedDate?: string;
  ageInDays: number;
  environment: 'dev' | 'test' | 'staging' | 'production';
  impact: ImpactLevel;
  component: string;
};
