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

/**
 * Abstraction over Control Tower data sources.
 * UI and hooks must depend on this interface — never on mock JSON or Jira clients directly.
 *
 * Swap implementations via DataProviderContext / createDataProvider():
 *   MockDataProvider (current) → JiraDataProvider (future)
 */
export type DataProvider = {
  readonly id: 'mock' | 'jira';

  // —— Core integration surface (required for future Jira swap) ——
  getPrograms(filters?: Partial<GlobalFilters>): Promise<Program[]>;
  getIssues(filters?: Partial<GlobalFilters>): Promise<Issue[]>;
  getDependencies(filters?: Partial<GlobalFilters>): Promise<Dependency[]>;
  getRisks(filters?: Partial<GlobalFilters>): Promise<Risk[]>;
  getReleases(filters?: Partial<GlobalFilters>): Promise<Release[]>;
  getIncidents(filters?: Partial<GlobalFilters>): Promise<Incident[]>;
  getTeams(): Promise<Team[]>;
  getMetrics(filters?: Partial<GlobalFilters>): Promise<PortfolioMetrics>;

  // —— Extended Control Tower reads (same provider; avoids UI→mock coupling) ——
  getProgramById(id: string): Promise<Program | null>;
  getMilestones(filters?: Partial<GlobalFilters>): Promise<Milestone[]>;
  getDecisions(filters?: Partial<GlobalFilters>): Promise<Decision[]>;
  getRoadmapItems(filters?: Partial<GlobalFilters>): Promise<RoadmapItem[]>;
  getSprints(filters?: Partial<GlobalFilters>): Promise<Sprint[]>;
  getDefects(filters?: Partial<GlobalFilters>): Promise<Defect[]>;
  getCapacities(filters?: Partial<GlobalFilters>): Promise<Capacity[]>;
  getBusinessOutcomes(filters?: Partial<GlobalFilters>): Promise<BusinessOutcome[]>;
  getDeliveryPeriodMetrics(filters?: Partial<GlobalFilters>): Promise<DeliveryPeriodMetric[]>;
  getWorkItemAging(filters?: Partial<GlobalFilters>): Promise<WorkItemAgingBucket[]>;
  getPortfolioKpis(filters?: Partial<GlobalFilters>): Promise<Kpi[]>;

  getOrgUnits(): Promise<OrgUnit[]>;
  getPeople(): Promise<Person[]>;
  getPortfolios(): Promise<Portfolio[]>;
  getProducts(): Promise<Product[]>;
  getQuarters(): Promise<FilterOption[]>;
  getCurrentUser(): Promise<CurrentUser>;
  getNotifications(): Promise<AppNotification[]>;
};

export type DataProviderKind = DataProvider['id'];
