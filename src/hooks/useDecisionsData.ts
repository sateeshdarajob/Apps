import { useQueries } from '@tanstack/react-query';
import { decisionService, programService } from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

export function useDecisionsData() {
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['decisions-programs', filters, refreshKey],
        queryFn: () => programService.getPrograms(filters),
      },
      {
        queryKey: ['decisions-decisions', filters, refreshKey],
        queryFn: () => decisionService.getDecisions(filters),
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
