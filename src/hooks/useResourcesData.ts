import { useQueries } from '@tanstack/react-query';
import { capacityService, programService } from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

export function useResourcesData() {
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['resources-programs', filters, refreshKey],
        queryFn: () => programService.getPrograms(filters),
      },
      {
        queryKey: ['resources-capacity', filters, refreshKey],
        queryFn: () => capacityService.getCapacities(filters),
      },
    ],
  });

  const [programsQuery, capacityQuery] = results;

  return {
    programs: programsQuery.data ?? [],
    capacities: capacityQuery.data ?? [],
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
