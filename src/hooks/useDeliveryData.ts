import { useQueries } from '@tanstack/react-query';
import { deliveryService, milestoneService, programService, sprintService } from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

/** Filter-aware datasets for the Delivery execution dashboard. */
export function useDeliveryData() {
  const { filters, refreshKey } = useGlobalFilters();

  const results = useQueries({
    queries: [
      {
        queryKey: ['delivery-programs', filters, refreshKey],
        queryFn: () => programService.getPrograms(filters),
      },
      {
        queryKey: ['delivery-sprints', filters, refreshKey],
        queryFn: () => sprintService.getSprints(filters),
      },
      {
        queryKey: ['delivery-milestones', filters, refreshKey],
        queryFn: () => milestoneService.getMilestones(filters),
      },
      {
        queryKey: ['delivery-period-metrics', filters, refreshKey],
        queryFn: () => deliveryService.getPeriodMetrics(filters),
      },
      {
        queryKey: ['delivery-aging', filters, refreshKey],
        queryFn: () => deliveryService.getWorkItemAging(filters),
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
