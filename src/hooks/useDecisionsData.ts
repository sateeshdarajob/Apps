import { useQueries } from '@tanstack/react-query';
import { useDataProvider } from '@/providers';
import { useGlobalFilters } from './useGlobalFilters';

export function useDecisionsData() {
  const provider = useDataProvider();
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['decisions-programs', provider.id, filters, refreshKey],
        queryFn: () => provider.getPrograms(filters),
      },
      {
        queryKey: ['decisions-decisions', provider.id, filters, refreshKey],
        queryFn: () => provider.getDecisions(filters),
      },
    ],
  });

  const [programsQuery, decisionsQuery] = results;

  return {
    programs: programsQuery.data ?? [],
    decisions: decisionsQuery.data ?? [],
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
