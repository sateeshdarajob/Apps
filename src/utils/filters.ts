import type {
  Capacity,
  Decision,
  Defect,
  DeliveryPeriodMetric,
  Dependency,
  GlobalFilters,
  Incident,
  Kpi,
  Milestone,
  Program,
  Release,
  Risk,
  RoadmapItem,
  Sprint,
  WorkItemAgingBucket,
} from '@/types';
import { programs } from '@/data/mock';

export type FilterableByProgram = {
  programId?: string;
};

export type FilterableByTeam = {
  teamId?: string;
};

export type FilterableByPortfolio = {
  portfolioId?: string;
};

export type FilterableByProduct = {
  productId?: string;
};

export type FilterableByQuarter = {
  quarter?: string;
};

export type FilterableByRag = {
  rag?: string;
};

function isAll(value: string | undefined): boolean {
  return !value || value === 'all';
}

function programIdsMatchingFilters(filters?: Partial<GlobalFilters>): Set<string> | null {
  if (!filters) return null;

  const matched = programs.filter((program) => matchesProgramFilters(program, filters));
  return new Set(matched.map((program) => program.id));
}

/** Core program filter used by the Control Tower global filter bar. */
export function matchesProgramFilters(program: Program, filters?: Partial<GlobalFilters>): boolean {
  if (!filters) return true;

  if (!isAll(filters.portfolioId) && program.portfolioId !== filters.portfolioId) return false;
  if (!isAll(filters.programId) && program.id !== filters.programId) return false;
  if (!isAll(filters.teamId) && program.teamId !== filters.teamId) return false;
  if (!isAll(filters.productId) && program.productId !== filters.productId) return false;
  if (!isAll(filters.ragStatus) && program.rag !== filters.ragStatus) return false;
  if (!isAll(filters.quarter) && program.quarter !== filters.quarter) return false;

  return true;
}

/**
 * Entities linked to a program inherit portfolio/team/product/RAG constraints
 * through their parent program unless they carry those dimensions directly.
 */
export function matchesProgramScopedFilters<T extends FilterableByProgram>(
  item: T,
  filters?: Partial<GlobalFilters>,
): boolean {
  if (!filters) return true;

  const allowedProgramIds = programIdsMatchingFilters(filters);
  if (!allowedProgramIds) return true;

  if (item.programId) {
    return allowedProgramIds.has(item.programId);
  }

  // Unscoped portfolio-level rows remain visible unless a specific program is selected.
  return isAll(filters.programId);
}

export function matchesTeamFilters<T extends FilterableByTeam>(
  item: T,
  filters?: Partial<GlobalFilters>,
): boolean {
  if (!filters || isAll(filters.teamId)) return true;
  return item.teamId === filters.teamId;
}

export function matchesPortfolioFilters<T extends FilterableByPortfolio>(
  item: T,
  filters?: Partial<GlobalFilters>,
): boolean {
  if (!filters || isAll(filters.portfolioId)) return true;
  return item.portfolioId === filters.portfolioId;
}

export function matchesProductFilters<T extends FilterableByProduct>(
  item: T,
  filters?: Partial<GlobalFilters>,
): boolean {
  if (!filters || isAll(filters.productId)) return true;
  return item.productId === filters.productId;
}

export function matchesQuarterFilters<T extends FilterableByQuarter>(
  item: T,
  filters?: Partial<GlobalFilters>,
): boolean {
  if (!filters || isAll(filters.quarter)) return true;
  return item.quarter === filters.quarter;
}

export function matchesRagFilters<T extends FilterableByRag>(
  item: T,
  filters?: Partial<GlobalFilters>,
): boolean {
  if (!filters || isAll(filters.ragStatus)) return true;
  return item.rag === filters.ragStatus;
}

export function filterPrograms(items: Program[], filters?: Partial<GlobalFilters>): Program[] {
  return items.filter((item) => matchesProgramFilters(item, filters));
}

export function filterMilestones(
  items: Milestone[],
  filters?: Partial<GlobalFilters>,
): Milestone[] {
  return items.filter(
    (item) => matchesProgramScopedFilters(item, filters) && matchesQuarterFilters(item, filters),
  );
}

export function filterDependencies(
  items: Dependency[],
  filters?: Partial<GlobalFilters>,
): Dependency[] {
  return items.filter((item) => matchesProgramScopedFilters(item, filters));
}

export function filterRisks(items: Risk[], filters?: Partial<GlobalFilters>): Risk[] {
  return items.filter((item) => matchesProgramScopedFilters(item, filters));
}

export function filterReleases(items: Release[], filters?: Partial<GlobalFilters>): Release[] {
  return items.filter(
    (item) => matchesProgramScopedFilters(item, filters) && matchesRagFilters(item, filters),
  );
}

export function filterIncidents(items: Incident[], filters?: Partial<GlobalFilters>): Incident[] {
  return items.filter((item) => matchesProgramScopedFilters(item, filters));
}

export function filterDecisions(items: Decision[], filters?: Partial<GlobalFilters>): Decision[] {
  return items.filter((item) => matchesProgramScopedFilters(item, filters));
}

export function filterRoadmapItems(
  items: RoadmapItem[],
  filters?: Partial<GlobalFilters>,
): RoadmapItem[] {
  return items.filter(
    (item) =>
      matchesProgramScopedFilters(item, filters) &&
      matchesTeamFilters(item, filters) &&
      matchesProductFilters(item, filters) &&
      matchesQuarterFilters(item, filters) &&
      matchesRagFilters(item, filters),
  );
}

export function filterSprints(items: Sprint[], filters?: Partial<GlobalFilters>): Sprint[] {
  return items.filter(
    (item) =>
      matchesProgramScopedFilters(item, filters) &&
      matchesTeamFilters(item, filters) &&
      matchesRagFilters(item, filters),
  );
}

export function filterDefects(items: Defect[], filters?: Partial<GlobalFilters>): Defect[] {
  return items.filter((item) => matchesProgramScopedFilters(item, filters));
}

export function filterCapacities(items: Capacity[], filters?: Partial<GlobalFilters>): Capacity[] {
  return items.filter(
    (item) =>
      matchesProgramScopedFilters(item, filters) &&
      matchesTeamFilters(item, filters) &&
      matchesPortfolioFilters(item, filters) &&
      matchesProductFilters(item, filters) &&
      matchesQuarterFilters(item, filters),
  );
}

export function filterKpis(items: Kpi[], filters?: Partial<GlobalFilters>): Kpi[] {
  return items.filter((item) => {
    if (!filters) return true;
    if (!isAll(filters.programId) && item.programId && item.programId !== filters.programId) {
      return false;
    }
    if (
      !isAll(filters.portfolioId) &&
      item.portfolioId &&
      item.portfolioId !== filters.portfolioId
    ) {
      return false;
    }
    if (!isAll(filters.teamId) && item.teamId && item.teamId !== filters.teamId) {
      return false;
    }
    if (!isAll(filters.quarter) && item.quarter && item.quarter !== filters.quarter) {
      return false;
    }
    if (!isAll(filters.ragStatus) && item.status && item.status !== filters.ragStatus) {
      return false;
    }
    return true;
  });
}

export function filterDeliveryPeriodMetrics(
  items: DeliveryPeriodMetric[],
  filters?: Partial<GlobalFilters>,
): DeliveryPeriodMetric[] {
  return items.filter((item) => matchesProgramScopedFilters(item, filters));
}

export function filterWorkItemAging(
  items: WorkItemAgingBucket[],
  filters?: Partial<GlobalFilters>,
): WorkItemAgingBucket[] {
  return items.filter(
    (item) => matchesProgramScopedFilters(item, filters) && matchesTeamFilters(item, filters),
  );
}
