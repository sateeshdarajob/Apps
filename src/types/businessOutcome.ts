import type { RagStatus } from './common';
import type { Person } from './org';

export type OutcomeStatus = 'projected' | 'onTrack' | 'atRisk' | 'achieved' | 'missed';

export type BusinessOutcome = {
  id: string;
  programId: string;
  title: string;
  description: string;
  metricName: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: OutcomeStatus;
  rag: RagStatus;
  owner: Person;
  targetDate: string;
  strategicTheme: string;
};
