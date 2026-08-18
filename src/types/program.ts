import type { Money, Priority, ProgramStatus, RagStatus } from './common';
import type { Person } from './org';
import type { Milestone } from './milestone';
import type { Risk } from './risk';
import type { Dependency } from './dependency';
import type { Release } from './release';
import type { BusinessOutcome } from './businessOutcome';

/**
 * Core engineering program aggregate used across the Control Tower.
 * Related collections reuse the shared entity interfaces (no duplicated shapes).
 */
export type Program = {
  id: string;
  name: string;
  code: string;
  description: string;
  owner: Person;
  executiveSponsor: Person;
  businessOwner: Person;
  priority: Priority;
  status: ProgramStatus;
  rag: RagStatus;
  startDate: string;
  targetDate: string;
  percentComplete: number;
  budget: Money;
  actualCost: Money;
  milestones: Milestone[];
  risks: Risk[];
  dependencies: Dependency[];
  blockers: Dependency[];
  releases: Release[];
  businessOutcome: BusinessOutcome;
  /** Dimensions used by global dashboard filters. */
  portfolioId: string;
  productId: string;
  teamId: string;
  orgUnitId: string;
  quarter: string;
  ragComment?: string;
  phaseLabel?: string;
};
