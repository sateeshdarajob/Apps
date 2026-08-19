import { useQueries } from '@tanstack/react-query';
import { useDataProvider } from '@/providers';
import { useGlobalFilters } from './useGlobalFilters';

export function useDependenciesData() {
  const provider = useDataProvider();
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['deps-programs', provider.id, filters, refreshKey],
        queryFn: () => provider.getPrograms(filters),
      },
      {
        queryKey: ['deps-dependencies', provider.id, filters, refreshKey],
        queryFn: () => provider.getDependencies(filters),
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
