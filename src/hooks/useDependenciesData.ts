import { useQueries } from '@tanstack/react-query';
import { dependencyService, programService } from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

/** Filter-aware datasets for the Dependencies page. */
export function useDependenciesData() {
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['deps-programs', filters, refreshKey],
        queryFn: () => programService.getPrograms(filters),
      },
      {
        queryKey: ['deps-dependencies', filters, refreshKey],
        queryFn: () => dependencyService.getDependencies(filters),
      },
    ],
  });

  const [programsQuery, dependenciesQuery] = results;

  return {
    programs: programsQuery.data ?? [],
    dependencies: dependenciesQuery.data ?? [],
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
