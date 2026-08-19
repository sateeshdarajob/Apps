import { useQueries } from '@tanstack/react-query';
import { useDataProvider } from '@/providers';
import { useGlobalFilters } from './useGlobalFilters';

/** Filter-aware datasets for the Delivery execution dashboard. */
export function useDeliveryData() {
  const provider = useDataProvider();
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['delivery-programs', provider.id, filters, refreshKey],
        queryFn: () => provider.getPrograms(filters),
      },
      {
        queryKey: ['delivery-sprints', provider.id, filters, refreshKey],
        queryFn: () => provider.getSprints(filters),
      },
      {
        queryKey: ['delivery-milestones', provider.id, filters, refreshKey],
        queryFn: () => provider.getMilestones(filters),
      },
      {
        queryKey: ['delivery-period-metrics', provider.id, filters, refreshKey],
        queryFn: () => provider.getDeliveryPeriodMetrics(filters),
      },
      {
        queryKey: ['delivery-aging', provider.id, filters, refreshKey],
        queryFn: () => provider.getWorkItemAging(filters),
      },
    ],
  });

  const [programsQuery, sprintsQuery, milestonesQuery, periodQuery, agingQuery] = results;

  return {
    programs: programsQuery.data ?? [],
    sprints: sprintsQuery.data ?? [],
    milestones: milestonesQuery.data ?? [],
    periodMetrics: periodQuery.data ?? [],
    aging: agingQuery.data ?? [],
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
