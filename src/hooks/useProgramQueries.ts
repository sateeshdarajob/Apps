import { useQuery } from '@tanstack/react-query';
import { programService, orgService, chartService } from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

export function usePrograms() {
  const { filters } = useGlobalFilters();

  return useQuery({
    queryKey: ['programs', filters.orgUnitId, filters.programId],
    queryFn: () => programService.getPrograms(filters),
  });
}

/** Unfiltered program list for global filter dropdowns. */
export function useProgramOptions() {
  return useQuery({
    queryKey: ['program-options'],
    queryFn: () => programService.getPrograms(),
  });
}

export function usePortfolioKpis() {
  return useQuery({
    queryKey: ['portfolio-kpis'],
    queryFn: () => programService.getPortfolioKpis(),
  });
}

export function useOrgUnits() {
  return useQuery({
    queryKey: ['org-units'],
    queryFn: () => orgService.getOrgUnits(),
  });
}

export function useDeliveryVelocity() {
  return useQuery({
    queryKey: ['delivery-velocity'],
    queryFn: () => chartService.getDeliveryVelocity(),
  });
}
