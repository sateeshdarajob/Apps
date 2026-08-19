import type { GlobalFilters } from '@/types';
import type { DataProvider } from './DataProvider';

/**
 * Future Jira-backed implementation.
 * Intentionally unimplemented — authentication and API mapping land in a later increment.
 * Swapping providers must not require UI rewrites; only this class + wiring change.
 */
export class JiraDataProvider implements DataProvider {
  readonly id = 'jira' as const;

  private notReady(method: string): never {
    throw new Error(
      `JiraDataProvider.${method} is not implemented yet. ` +
        'Keep MockDataProvider active until Jira auth and field mapping are delivered.',
    );
  }

  getPrograms(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getPrograms');
  }

  getIssues(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getIssues');
  }

  getDependencies(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getDependencies');
  }

  getRisks(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getRisks');
  }

  getReleases(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getReleases');
  }

  getIncidents(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getIncidents');
  }

  getTeams() {
    return this.notReady('getTeams');
  }

  getMetrics(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getMetrics');
  }

  getProgramById(_id: string) {
    return this.notReady('getProgramById');
  }

  getMilestones(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getMilestones');
  }

  getDecisions(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getDecisions');
  }

  getRoadmapItems(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getRoadmapItems');
  }

  getSprints(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getSprints');
  }

  getDefects(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getDefects');
  }

  getCapacities(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getCapacities');
  }

  getBusinessOutcomes(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getBusinessOutcomes');
  }

  getDeliveryPeriodMetrics(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getDeliveryPeriodMetrics');
  }

  getWorkItemAging(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getWorkItemAging');
  }

  getPortfolioKpis(_filters?: Partial<GlobalFilters>) {
    return this.notReady('getPortfolioKpis');
  }

  getOrgUnits() {
    return this.notReady('getOrgUnits');
  }

  getPeople() {
    return this.notReady('getPeople');
  }

  getPortfolios() {
    return this.notReady('getPortfolios');
  }

  getProducts() {
    return this.notReady('getProducts');
  }

  getQuarters() {
    return this.notReady('getQuarters');
  }

  getCurrentUser() {
    return this.notReady('getCurrentUser');
  }

  getNotifications() {
    return this.notReady('getNotifications');
  }
}
