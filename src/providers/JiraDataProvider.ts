import type {
  AppNotification,
  BusinessOutcome,
  Capacity,
  CurrentUser,
  Decision,
  Defect,
  DeliveryPeriodMetric,
  Dependency,
  FilterOption,
  GlobalFilters,
  Incident,
  Issue,
  Kpi,
  Milestone,
  OrgUnit,
  Person,
  Portfolio,
  PortfolioMetrics,
  Product,
  Program,
  Release,
  Risk,
  RoadmapItem,
  Sprint,
  Team,
  WorkItemAgingBucket,
} from '@/types';
import type { DataProvider } from './DataProvider';

/**
 * Future Jira-backed implementation.
 * Intentionally unimplemented — authentication and API mapping land in a later increment.
 * Methods reject with a Promise so callers using async/await observe a consistent contract.
 */
export class JiraDataProvider implements DataProvider {
  readonly id = 'jira' as const;

  private notReady<T>(method: string): Promise<T> {
    return Promise.reject(
      new Error(
        `JiraDataProvider.${method} is not implemented yet. ` +
          'Keep MockDataProvider active until Jira auth and field mapping are delivered.',
      ),
    );
  }

  getPrograms(_filters?: Partial<GlobalFilters>): Promise<Program[]> {
    return this.notReady('getPrograms');
  }

  getIssues(_filters?: Partial<GlobalFilters>): Promise<Issue[]> {
    return this.notReady('getIssues');
  }

  getDependencies(_filters?: Partial<GlobalFilters>): Promise<Dependency[]> {
    return this.notReady('getDependencies');
  }

  getRisks(_filters?: Partial<GlobalFilters>): Promise<Risk[]> {
    return this.notReady('getRisks');
  }

  getReleases(_filters?: Partial<GlobalFilters>): Promise<Release[]> {
    return this.notReady('getReleases');
  }

  getIncidents(_filters?: Partial<GlobalFilters>): Promise<Incident[]> {
    return this.notReady('getIncidents');
  }

  getTeams(): Promise<Team[]> {
    return this.notReady('getTeams');
  }

  getMetrics(_filters?: Partial<GlobalFilters>): Promise<PortfolioMetrics> {
    return this.notReady('getMetrics');
  }

  getProgramById(_id: string): Promise<Program | null> {
    return this.notReady('getProgramById');
  }

  getMilestones(_filters?: Partial<GlobalFilters>): Promise<Milestone[]> {
    return this.notReady('getMilestones');
  }

  getDecisions(_filters?: Partial<GlobalFilters>): Promise<Decision[]> {
    return this.notReady('getDecisions');
  }

  getRoadmapItems(_filters?: Partial<GlobalFilters>): Promise<RoadmapItem[]> {
    return this.notReady('getRoadmapItems');
  }

  getSprints(_filters?: Partial<GlobalFilters>): Promise<Sprint[]> {
    return this.notReady('getSprints');
  }

  getDefects(_filters?: Partial<GlobalFilters>): Promise<Defect[]> {
    return this.notReady('getDefects');
  }

  getCapacities(_filters?: Partial<GlobalFilters>): Promise<Capacity[]> {
    return this.notReady('getCapacities');
  }

  getBusinessOutcomes(_filters?: Partial<GlobalFilters>): Promise<BusinessOutcome[]> {
    return this.notReady('getBusinessOutcomes');
  }

  getDeliveryPeriodMetrics(
    _filters?: Partial<GlobalFilters>,
  ): Promise<DeliveryPeriodMetric[]> {
    return this.notReady('getDeliveryPeriodMetrics');
  }

  getWorkItemAging(_filters?: Partial<GlobalFilters>): Promise<WorkItemAgingBucket[]> {
    return this.notReady('getWorkItemAging');
  }

  getPortfolioKpis(_filters?: Partial<GlobalFilters>): Promise<Kpi[]> {
    return this.notReady('getPortfolioKpis');
  }

  getOrgUnits(): Promise<OrgUnit[]> {
    return this.notReady('getOrgUnits');
  }

  getPeople(): Promise<Person[]> {
    return this.notReady('getPeople');
  }

  getPortfolios(): Promise<Portfolio[]> {
    return this.notReady('getPortfolios');
  }

  getProducts(): Promise<Product[]> {
    return this.notReady('getProducts');
  }

  getQuarters(): Promise<FilterOption[]> {
    return this.notReady('getQuarters');
  }

  getCurrentUser(): Promise<CurrentUser> {
    return this.notReady('getCurrentUser');
  }

  getNotifications(): Promise<AppNotification[]> {
    return this.notReady('getNotifications');
  }
}
