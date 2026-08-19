/**
 * Thin service facades over the active DataProvider.
 * Prefer `useDataProvider()` in React code; these remain for gradual migration
 * and non-React callers. They must never import `@/data/mock`.
 */
import { getDataProvider } from '@/providers';
import type { GlobalFilters } from '@/types';

export const programService = {
  getPrograms: (filters?: Partial<GlobalFilters>) => getDataProvider().getPrograms(filters),
  getProgramById: (id: string) => getDataProvider().getProgramById(id),
  getPortfolioKpis: (filters?: Partial<GlobalFilters>) =>
    getDataProvider().getPortfolioKpis(filters),
};

export const milestoneService = {
  getMilestones: (filters?: Partial<GlobalFilters>) => getDataProvider().getMilestones(filters),
};

export const riskService = {
  getRisks: (filters?: Partial<GlobalFilters>) => getDataProvider().getRisks(filters),
};

export const dependencyService = {
  getDependencies: (filters?: Partial<GlobalFilters>) =>
    getDataProvider().getDependencies(filters),
};

export const releaseService = {
  getReleases: (filters?: Partial<GlobalFilters>) => getDataProvider().getReleases(filters),
};

export const incidentService = {
  getIncidents: (filters?: Partial<GlobalFilters>) => getDataProvider().getIncidents(filters),
};

export const decisionService = {
  getDecisions: (filters?: Partial<GlobalFilters>) => getDataProvider().getDecisions(filters),
};

export const roadmapService = {
  getRoadmapItems: (filters?: Partial<GlobalFilters>) =>
    getDataProvider().getRoadmapItems(filters),
};

export const sprintService = {
  getSprints: (filters?: Partial<GlobalFilters>) => getDataProvider().getSprints(filters),
};

export const deliveryService = {
  getPeriodMetrics: (filters?: Partial<GlobalFilters>) =>
    getDataProvider().getDeliveryPeriodMetrics(filters),
  getWorkItemAging: (filters?: Partial<GlobalFilters>) =>
    getDataProvider().getWorkItemAging(filters),
};

export const defectService = {
  getDefects: (filters?: Partial<GlobalFilters>) => getDataProvider().getDefects(filters),
};

export const issueService = {
  getIssues: (filters?: Partial<GlobalFilters>) => getDataProvider().getIssues(filters),
};

export const capacityService = {
  getCapacities: (filters?: Partial<GlobalFilters>) => getDataProvider().getCapacities(filters),
};

export const businessOutcomeService = {
  getBusinessOutcomes: (filters?: Partial<GlobalFilters>) =>
    getDataProvider().getBusinessOutcomes(filters),
};

export const metricsService = {
  getMetrics: (filters?: Partial<GlobalFilters>) => getDataProvider().getMetrics(filters),
};

export const orgService = {
  getOrgUnits: () => getDataProvider().getOrgUnits(),
  getPeople: () => getDataProvider().getPeople(),
};

export const filterOptionsService = {
  getPortfolios: () => getDataProvider().getPortfolios(),
  getTeams: () => getDataProvider().getTeams(),
  getProducts: () => getDataProvider().getProducts(),
  getQuarters: () => getDataProvider().getQuarters(),
  getCurrentUser: () => getDataProvider().getCurrentUser(),
  getNotifications: () => getDataProvider().getNotifications(),
};

export const chartService = {
  getDeliveryVelocity: async () => (await getDataProvider().getMetrics()).deliveryVelocity,
  getRagDistribution: async () => (await getDataProvider().getMetrics()).ragDistribution,
  getCapacityByOrg: async () => (await getDataProvider().getMetrics()).capacityByOrg,
};
