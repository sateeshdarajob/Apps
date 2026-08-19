import { useQueries } from '@tanstack/react-query';
import { programService, riskService } from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

export function useRisksData() {
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['risks-programs', filters, refreshKey],
        queryFn: () => programService.getPrograms(filters),
      },
      {
        queryKey: ['risks-risks', filters, refreshKey],
        queryFn: () => riskService.getRisks(filters),
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
