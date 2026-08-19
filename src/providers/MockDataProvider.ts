import type {
  Defect,
  GlobalFilters,
  Issue,
  PortfolioMetrics,
  Program,
} from '@/types';
import type { DataProvider } from './DataProvider';
import {
  businessOutcomes,
  capacities,
  capacityByOrg,
  currentUser,
  decisions,
  defects,
  deliveryPeriodMetrics,
  deliveryVelocityTrend,
  dependencies,
  incidents,
  milestones,
  notifications,
  orgUnits,
  people,
  portfolioKpis,
  portfolios,
  products,
  programs,
  quarters,
  ragDistribution,
  releases,
  risks,
  roadmapItems,
  sprints,
  teams,
  workItemAging,
} from '@/data/mock';
import {
  filterCapacities,
  filterDecisions,
  filterDefects,
  filterDeliveryPeriodMetrics,
  filterDependencies,
  filterIncidents,
  filterIssues,
  filterKpis,
  filterMilestones,
  filterPrograms,
  filterReleases,
  filterRisks,
  filterRoadmapItems,
  filterSprints,
  filterWorkItemAging,
} from '@/utils/filters';

const MOCK_LATENCY_MS = 250;

function delay<T>(value: T, ms = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

function defectStatusToWorkflow(status: Defect['status']): string {
  return status;
}

function defectToIssue(defect: Defect): Issue {
  return {
    id: defect.id,
    key: defect.id.replace('def-', 'MOCK-'),
    summary: defect.title,
    description: defect.description,
    issueType: defect.severity === 'blocker' || defect.severity === 'critical' ? 'bug' : 'bug',
    status: defectStatusToWorkflow(defect.status),
    priority: defect.priority,
    programId: defect.programId,
    assignee: defect.owner,
    reporter: defect.reporter,
    labels: [defect.component, defect.environment],
    createdAt: defect.foundDate,
    updatedAt: defect.resolvedDate,
    dueDate: defect.targetFixDate,
    source: 'mock',
  };
}

/**
 * Current production data source for the Control Tower.
 * Only this module (and tests) should import `@/data/mock`.
 */
export class MockDataProvider implements DataProvider {
  readonly id = 'mock' as const;

  private ctx() {
    return { programs };
  }

  getPrograms(filters?: Partial<GlobalFilters>): Promise<Program[]> {
    return delay(filterPrograms(programs, filters));
  }

  getProgramById(id: string): Promise<Program | null> {
    return delay(programs.find((program) => program.id === id) ?? null);
  }

  getIssues(filters?: Partial<GlobalFilters>): Promise<Issue[]> {
    const issues = defects.map(defectToIssue);
    return delay(filterIssues(issues, filters, this.ctx()));
  }

  getDependencies(filters?: Partial<GlobalFilters>) {
    return delay(filterDependencies(dependencies, filters, this.ctx()));
  }

  getRisks(filters?: Partial<GlobalFilters>) {
    return delay(filterRisks(risks, filters, this.ctx()));
  }

  getReleases(filters?: Partial<GlobalFilters>) {
    return delay(filterReleases(releases, filters, this.ctx()));
  }

  getIncidents(filters?: Partial<GlobalFilters>) {
    return delay(filterIncidents(incidents, filters, this.ctx()));
  }

  getTeams() {
    return delay(teams);
  }

  async getMetrics(filters?: Partial<GlobalFilters>): Promise<PortfolioMetrics> {
    const kpis = filterKpis(portfolioKpis, filters);
    return delay({
      kpis,
      deliveryVelocity: deliveryVelocityTrend,
      ragDistribution,
      capacityByOrg,
    });
  }

  getMilestones(filters?: Partial<GlobalFilters>) {
    return delay(filterMilestones(milestones, filters, this.ctx()));
  }

  getDecisions(filters?: Partial<GlobalFilters>) {
    return delay(filterDecisions(decisions, filters, this.ctx()));
  }

  getRoadmapItems(filters?: Partial<GlobalFilters>) {
    return delay(filterRoadmapItems(roadmapItems, filters, this.ctx()));
  }

  getSprints(filters?: Partial<GlobalFilters>) {
    return delay(filterSprints(sprints, filters, this.ctx()));
  }

  getDefects(filters?: Partial<GlobalFilters>) {
    return delay(filterDefects(defects, filters, this.ctx()));
  }

  getCapacities(filters?: Partial<GlobalFilters>) {
    return delay(filterCapacities(capacities, filters, this.ctx()));
  }

  getBusinessOutcomes(filters?: Partial<GlobalFilters>) {
    const allowed = new Set(filterPrograms(programs, filters).map((program) => program.id));
    return delay(businessOutcomes.filter((outcome) => allowed.has(outcome.programId)));
  }

  getDeliveryPeriodMetrics(filters?: Partial<GlobalFilters>) {
    return delay(filterDeliveryPeriodMetrics(deliveryPeriodMetrics, filters, this.ctx()));
  }

  getWorkItemAging(filters?: Partial<GlobalFilters>) {
    return delay(filterWorkItemAging(workItemAging, filters, this.ctx()));
  }

  getPortfolioKpis(filters?: Partial<GlobalFilters>) {
    return delay(filterKpis(portfolioKpis, filters));
  }

  getOrgUnits() {
    return delay(orgUnits);
  }

  getPeople() {
    return delay(people);
  }

  getPortfolios() {
    return delay(portfolios);
  }

  getProducts() {
    return delay(products);
  }

  getQuarters() {
    return delay(quarters);
  }

  getCurrentUser() {
    return delay(currentUser);
  }

  getNotifications() {
    return delay(notifications);
  }
}
