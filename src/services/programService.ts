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
  portfolios,
  teams,
  products,
  quarters,
  currentUser,
  notifications,
  milestones,
  releases,
  incidents,
  decisions,
  businessOutcomes,
  roadmapItems,
  sprints,
  defects,
  capacities,
} from '@/data/mock';
import type { GlobalFilters } from '@/types';
import {
  filterCapacities,
  filterDecisions,
  filterDefects,
  filterDependencies,
  filterIncidents,
  filterKpis,
  filterMilestones,
  filterPrograms,
  filterReleases,
  filterRisks,
  filterRoadmapItems,
  filterSprints,
} from '@/utils/filters';

const MOCK_LATENCY_MS = 250;

function delay<T>(value: T, ms = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

/** Async mock services mirror future API clients so TanStack Query hooks stay stable. */
export const programService = {
  getPrograms: (filters?: Partial<GlobalFilters>) => delay(filterPrograms(programs, filters)),

  getProgramById: (id: string) => delay(programs.find((program) => program.id === id) ?? null),

  getPortfolioKpis: (filters?: Partial<GlobalFilters>) => delay(filterKpis(portfolioKpis, filters)),
};

export const milestoneService = {
  getMilestones: (filters?: Partial<GlobalFilters>) => delay(filterMilestones(milestones, filters)),
};

export const riskService = {
  getRisks: (filters?: Partial<GlobalFilters>) => delay(filterRisks(risks, filters)),
};

export const dependencyService = {
  getDependencies: (filters?: Partial<GlobalFilters>) =>
    delay(filterDependencies(dependencies, filters)),
};

export const releaseService = {
  getReleases: (filters?: Partial<GlobalFilters>) => delay(filterReleases(releases, filters)),
};

export const incidentService = {
  getIncidents: (filters?: Partial<GlobalFilters>) => delay(filterIncidents(incidents, filters)),
};

export const decisionService = {
  getDecisions: (filters?: Partial<GlobalFilters>) => delay(filterDecisions(decisions, filters)),
};

export const roadmapService = {
  getRoadmapItems: (filters?: Partial<GlobalFilters>) =>
    delay(filterRoadmapItems(roadmapItems, filters)),
};

export const sprintService = {
  getSprints: (filters?: Partial<GlobalFilters>) => delay(filterSprints(sprints, filters)),
};

export const defectService = {
  getDefects: (filters?: Partial<GlobalFilters>) => delay(filterDefects(defects, filters)),
};

export const capacityService = {
  getCapacities: (filters?: Partial<GlobalFilters>) => delay(filterCapacities(capacities, filters)),
};

export const businessOutcomeService = {
  getBusinessOutcomes: (filters?: Partial<GlobalFilters>) =>
    delay(
      businessOutcomes.filter((outcome) =>
        filterPrograms(programs, filters).some((program) => program.id === outcome.programId),
      ),
    ),
};

export const orgService = {
  getOrgUnits: () => delay(orgUnits),
  getPeople: () => delay(people),
};

export const filterOptionsService = {
  getPortfolios: () => delay(portfolios),
  getTeams: () => delay(teams),
  getProducts: () => delay(products),
  getQuarters: () => delay(quarters),
  getCurrentUser: () => delay(currentUser),
  getNotifications: () => delay(notifications),
};

export const chartService = {
  getDeliveryVelocity: () => delay(deliveryVelocityTrend),
  getRagDistribution: () => delay(ragDistribution),
  getCapacityByOrg: () => delay(capacityByOrg),
};
