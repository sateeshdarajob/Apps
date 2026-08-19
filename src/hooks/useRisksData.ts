import { useQueries } from '@tanstack/react-query';
import { useDataProvider } from '@/providers';
import { useGlobalFilters } from './useGlobalFilters';

export function useRisksData() {
  const provider = useDataProvider();
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['risks-programs', provider.id, filters, refreshKey],
        queryFn: () => provider.getPrograms(filters),
      },
      {
        queryKey: ['risks-risks', provider.id, filters, refreshKey],
        queryFn: () => provider.getRisks(filters),
      },
    ],
  });

  const [programsQuery, risksQuery] = results;

  return {
    programs: programsQuery.data ?? [],
    risks: risksQuery.data ?? [],
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
