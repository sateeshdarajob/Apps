import { useQueries } from '@tanstack/react-query';
import {
  decisionService,
  dependencyService,
  milestoneService,
  programService,
  releaseService,
  roadmapService,
} from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

/** Filter-aware datasets for the portfolio Roadmap view. */
export function useRoadmapData() {
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['roadmap-programs', filters, refreshKey],
        queryFn: () => programService.getPrograms(filters),
      },
      {
        queryKey: ['roadmap-items', filters, refreshKey],
        queryFn: () => roadmapService.getRoadmapItems(filters),
      },
      {
        queryKey: ['roadmap-milestones', filters, refreshKey],
        queryFn: () => milestoneService.getMilestones(filters),
      },
      {
        queryKey: ['roadmap-releases', filters, refreshKey],
        queryFn: () => releaseService.getReleases(filters),
      },
      {
        queryKey: ['roadmap-dependencies', filters, refreshKey],
        queryFn: () => dependencyService.getDependencies(filters),
      },
      {
        queryKey: ['roadmap-decisions', filters, refreshKey],
        queryFn: () => decisionService.getDecisions(filters),
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
