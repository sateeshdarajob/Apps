import { useQueries } from '@tanstack/react-query';
import { useDataProvider } from '@/providers';
import { useGlobalFilters } from './useGlobalFilters';

export function useReleasesData() {
  const provider = useDataProvider();
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['releases-programs', provider.id, filters, refreshKey],
        queryFn: () => provider.getPrograms(filters),
      },
      {
        queryKey: ['releases-releases', provider.id, filters, refreshKey],
        queryFn: () => provider.getReleases(filters),
      },
      {
        queryKey: ['releases-defects', provider.id, filters, refreshKey],
        queryFn: () => provider.getDefects(filters),
      },
      {
        queryKey: ['releases-incidents', provider.id, filters, refreshKey],
        queryFn: () => provider.getIncidents(filters),
      },
      {
        queryKey: ['releases-risks', provider.id, filters, refreshKey],
        queryFn: () => provider.getRisks(filters),
      },
      {
        queryKey: ['releases-dependencies', provider.id, filters, refreshKey],
        queryFn: () => provider.getDependencies(filters),
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
