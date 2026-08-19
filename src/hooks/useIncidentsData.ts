import { useQueries } from '@tanstack/react-query';
import { useDataProvider } from '@/providers';
import { useGlobalFilters } from './useGlobalFilters';

export function useIncidentsData() {
  const provider = useDataProvider();
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['incidents-programs', provider.id, filters, refreshKey],
        queryFn: () => provider.getPrograms(filters),
      },
      {
        queryKey: ['incidents-incidents', provider.id, filters, refreshKey],
        queryFn: () => provider.getIncidents(filters),
      },
    ],
  });

  const [programsQuery, incidentsQuery] = results;

  return {
    programs: programsQuery.data ?? [],
    incidents: incidentsQuery.data ?? [],
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
