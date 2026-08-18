import { useQuery } from '@tanstack/react-query';
import { programService, orgService, chartService, filterOptionsService } from '@/services';
import { useGlobalFilters } from './useGlobalFilters';

export function usePrograms() {
  const { filters, refreshKey } = useGlobalFilters();

  return useQuery({
    queryKey: ['programs', filters, refreshKey],
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
  const { refreshKey } = useGlobalFilters();

  return useQuery({
    queryKey: ['portfolio-kpis', refreshKey],
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
  const { refreshKey } = useGlobalFilters();

  return useQuery({
    queryKey: ['delivery-velocity', refreshKey],
    queryFn: () => chartService.getDeliveryVelocity(),
  });
}

export function useFilterOptions() {
  const portfolios = useQuery({
    queryKey: ['filter-portfolios'],
    queryFn: () => filterOptionsService.getPortfolios(),
  });
  const teams = useQuery({
    queryKey: ['filter-teams'],
    queryFn: () => filterOptionsService.getTeams(),
  });
  const products = useQuery({
    queryKey: ['filter-products'],
    queryFn: () => filterOptionsService.getProducts(),
  });
  const quarters = useQuery({
    queryKey: ['filter-quarters'],
    queryFn: () => filterOptionsService.getQuarters(),
  });
  const programs = useProgramOptions();

  return {
    portfolios: portfolios.data ?? [],
    teams: teams.data ?? [],
    products: products.data ?? [],
    quarters: quarters.data ?? [],
    programs: programs.data ?? [],
    isLoading:
      portfolios.isLoading ||
      teams.isLoading ||
      products.isLoading ||
      quarters.isLoading ||
      programs.isLoading,
  };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: () => filterOptionsService.getCurrentUser(),
  });
}

export function useNotifications() {
  const { refreshKey } = useGlobalFilters();

  return useQuery({
    queryKey: ['notifications', refreshKey],
    queryFn: () => filterOptionsService.getNotifications(),
  });
}
