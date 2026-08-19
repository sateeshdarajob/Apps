import { useQueries } from '@tanstack/react-query';
import { useDataProvider } from '@/providers';
import { useGlobalFilters } from './useGlobalFilters';

/** Filter-aware datasets for the portfolio Roadmap view. */
export function useRoadmapData() {
  const provider = useDataProvider();
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['roadmap-programs', provider.id, filters, refreshKey],
        queryFn: () => provider.getPrograms(filters),
      },
      {
        queryKey: ['roadmap-items', provider.id, filters, refreshKey],
        queryFn: () => provider.getRoadmapItems(filters),
      },
      {
        queryKey: ['roadmap-milestones', provider.id, filters, refreshKey],
        queryFn: () => provider.getMilestones(filters),
      },
      {
        queryKey: ['roadmap-releases', provider.id, filters, refreshKey],
        queryFn: () => provider.getReleases(filters),
      },
      {
        queryKey: ['roadmap-dependencies', provider.id, filters, refreshKey],
        queryFn: () => provider.getDependencies(filters),
      },
      {
        queryKey: ['roadmap-decisions', provider.id, filters, refreshKey],
        queryFn: () => provider.getDecisions(filters),
      },
    ],
  });

  const [
    programsQuery,
    itemsQuery,
    milestonesQuery,
    releasesQuery,
    dependenciesQuery,
    decisionsQuery,
  ] = results;

  return {
    programs: programsQuery.data ?? [],
    roadmapItems: itemsQuery.data ?? [],
    milestones: milestonesQuery.data ?? [],
    releases: releasesQuery.data ?? [],
    dependencies: dependenciesQuery.data ?? [],
    decisions: decisionsQuery.data ?? [],
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
