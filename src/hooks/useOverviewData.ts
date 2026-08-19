import { useQueries } from '@tanstack/react-query';
import { useDataProvider } from '@/providers';
import { useGlobalFilters } from './useGlobalFilters';

/** Aggregated, filter-aware datasets for the Overview executive dashboard. */
export function useOverviewData() {
  const provider = useDataProvider();
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['overview-programs', provider.id, filters, refreshKey],
        queryFn: () => provider.getPrograms(filters),
      },
      {
        queryKey: ['overview-milestones', provider.id, filters, refreshKey],
        queryFn: () => provider.getMilestones(filters),
      },
      {
        queryKey: ['overview-dependencies', provider.id, filters, refreshKey],
        queryFn: () => provider.getDependencies(filters),
      },
      {
        queryKey: ['overview-risks', provider.id, filters, refreshKey],
        queryFn: () => provider.getRisks(filters),
      },
      {
        queryKey: ['overview-releases', provider.id, filters, refreshKey],
        queryFn: () => provider.getReleases(filters),
      },
      {
        queryKey: ['overview-incidents', provider.id, filters, refreshKey],
        queryFn: () => provider.getIncidents(filters),
      },
      {
        queryKey: ['overview-decisions', provider.id, filters, refreshKey],
        queryFn: () => provider.getDecisions(filters),
      },
      {
        queryKey: ['overview-capacities', provider.id, filters, refreshKey],
        queryFn: () => provider.getCapacities(filters),
      },
      {
        queryKey: ['overview-outcomes', provider.id, filters, refreshKey],
        queryFn: () => provider.getBusinessOutcomes(filters),
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
