import { useQueries } from '@tanstack/react-query';
import {
  capacityService,
  decisionService,
  dependencyService,
  incidentService,
  milestoneService,
  programService,
  releaseService,
  riskService,
  businessOutcomeService,
} from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

/** Aggregated, filter-aware datasets for the Overview executive dashboard. */
export function useOverviewData() {
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['overview-programs', filters, refreshKey],
        queryFn: () => programService.getPrograms(filters),
      },
      {
        queryKey: ['overview-milestones', filters, refreshKey],
        queryFn: () => milestoneService.getMilestones(filters),
      },
      {
        queryKey: ['overview-dependencies', filters, refreshKey],
        queryFn: () => dependencyService.getDependencies(filters),
      },
      {
        queryKey: ['overview-risks', filters, refreshKey],
        queryFn: () => riskService.getRisks(filters),
      },
      {
        queryKey: ['overview-releases', filters, refreshKey],
        queryFn: () => releaseService.getReleases(filters),
      },
      {
        queryKey: ['overview-incidents', filters, refreshKey],
        queryFn: () => incidentService.getIncidents(filters),
      },
      {
        queryKey: ['overview-decisions', filters, refreshKey],
        queryFn: () => decisionService.getDecisions(filters),
      },
      {
        queryKey: ['overview-capacities', filters, refreshKey],
        queryFn: () => capacityService.getCapacities(filters),
      },
      {
        queryKey: ['overview-outcomes', filters, refreshKey],
        queryFn: () => businessOutcomeService.getBusinessOutcomes(filters),
      },
    ],
  });

  const [
    programsQuery,
    milestonesQuery,
    dependenciesQuery,
    risksQuery,
    releasesQuery,
    incidentsQuery,
    decisionsQuery,
    capacitiesQuery,
    outcomesQuery,
  ] = results;

  return {
    programs: programsQuery.data ?? [],
    milestones: milestonesQuery.data ?? [],
    dependencies: dependenciesQuery.data ?? [],
    risks: risksQuery.data ?? [],
    releases: releasesQuery.data ?? [],
    incidents: incidentsQuery.data ?? [],
    decisions: decisionsQuery.data ?? [],
    capacities: capacitiesQuery.data ?? [],
    outcomes: outcomesQuery.data ?? [],
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
