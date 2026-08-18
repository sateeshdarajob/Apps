import {
  programs,
  risks,
  dependencies,
  orgUnits,
  people,
  portfolioKpis,
  deliveryVelocityTrend,
  ragDistribution,
  capacityByOrg,
} from '@/data/mock';
import type { GlobalFilters, Program } from '@/types';

const MOCK_LATENCY_MS = 250;

function delay<T>(value: T, ms = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

function matchesFilters(program: Program, filters?: Partial<GlobalFilters>): boolean {
  if (!filters) return true;
  if (filters.orgUnitId && filters.orgUnitId !== 'all' && program.orgUnitId !== filters.orgUnitId) {
    return false;
  }
  if (filters.programId && filters.programId !== 'all' && program.id !== filters.programId) {
    return false;
  }
  return true;
}

/** Async mock services mirror future API clients so TanStack Query hooks stay stable. */
export const programService = {
  getPrograms: (filters?: Partial<GlobalFilters>) =>
    delay(programs.filter((program) => matchesFilters(program, filters))),

  getProgramById: (id: string) => delay(programs.find((program) => program.id === id) ?? null),

  getPortfolioKpis: () => delay(portfolioKpis),
};

export const riskService = {
  getRisks: (programId?: string) =>
    delay(programId ? risks.filter((risk) => risk.programId === programId) : risks),
};

export const dependencyService = {
  getDependencies: (programId?: string) =>
    delay(
      programId
        ? dependencies.filter((dependency) => dependency.programId === programId)
        : dependencies,
    ),
};

export const orgService = {
  getOrgUnits: () => delay(orgUnits),
  getPeople: () => delay(people),
};

export const chartService = {
  getDeliveryVelocity: () => delay(deliveryVelocityTrend),
  getRagDistribution: () => delay(ragDistribution),
  getCapacityByOrg: () => delay(capacityByOrg),
};
