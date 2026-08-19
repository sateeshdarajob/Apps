import { useQueries } from '@tanstack/react-query';
import {
  defectService,
  incidentService,
  programService,
  releaseService,
  riskService,
  dependencyService,
} from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

export function useReleasesData() {
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['releases-programs', filters, refreshKey],
        queryFn: () => programService.getPrograms(filters),
      },
      {
        queryKey: ['releases-releases', filters, refreshKey],
        queryFn: () => releaseService.getReleases(filters),
      },
      {
        queryKey: ['releases-defects', filters, refreshKey],
        queryFn: () => defectService.getDefects(filters),
      },
      {
        queryKey: ['releases-incidents', filters, refreshKey],
        queryFn: () => incidentService.getIncidents(filters),
      },
      {
        queryKey: ['releases-risks', filters, refreshKey],
        queryFn: () => riskService.getRisks(filters),
      },
      {
        queryKey: ['releases-dependencies', filters, refreshKey],
        queryFn: () => dependencyService.getDependencies(filters),
      },
    ],
  });

  const [
    programsQuery,
    releasesQuery,
    defectsQuery,
    incidentsQuery,
    risksQuery,
    dependenciesQuery,
  ] = results;

  return {
    programs: programsQuery.data ?? [],
    releases: releasesQuery.data ?? [],
    defects: defectsQuery.data ?? [],
    incidents: incidentsQuery.data ?? [],
    risks: risksQuery.data ?? [],
    dependencies: dependenciesQuery.data ?? [],
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
