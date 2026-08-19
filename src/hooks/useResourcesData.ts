import { useQueries } from '@tanstack/react-query';
import { useDataProvider } from '@/providers';
import { useGlobalFilters } from './useGlobalFilters';

export function useResourcesData() {
  const provider = useDataProvider();
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['resources-programs', provider.id, filters, refreshKey],
        queryFn: () => provider.getPrograms(filters),
      },
      {
        queryKey: ['resources-capacity', provider.id, filters, refreshKey],
        queryFn: () => provider.getCapacities(filters),
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
