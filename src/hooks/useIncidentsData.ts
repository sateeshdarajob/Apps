import { useQueries } from '@tanstack/react-query';
import { incidentService, programService } from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

export function useIncidentsData() {
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['incidents-programs', filters, refreshKey],
        queryFn: () => programService.getPrograms(filters),
      },
      {
        queryKey: ['incidents-incidents', filters, refreshKey],
        queryFn: () => incidentService.getIncidents(filters),
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
