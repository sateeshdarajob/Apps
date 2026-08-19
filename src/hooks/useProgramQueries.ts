import { useQuery } from '@tanstack/react-query';
import { useDataProvider } from '@/providers';
import { useGlobalFilters } from './useGlobalFilters';

export function usePrograms() {
  const provider = useDataProvider();
  const { filters, refreshKey } = useGlobalFilters();

  return useQuery({
    queryKey: ['programs', provider.id, filters, refreshKey],
    queryFn: () => provider.getPrograms(filters),
  });
}

/** Unfiltered program list for global filter dropdowns. */
export function useProgramOptions() {
  const provider = useDataProvider();

  return useQuery({
    queryKey: ['program-options', provider.id],
    queryFn: () => provider.getPrograms(),
  });
}

export function usePortfolioKpis() {
  const provider = useDataProvider();
  const { refreshKey } = useGlobalFilters();

  return useQuery({
    queryKey: ['portfolio-kpis', provider.id, refreshKey],
    queryFn: () => provider.getPortfolioKpis(),
  });
}

export function useOrgUnits() {
  const provider = useDataProvider();

  return useQuery({
    queryKey: ['org-units', provider.id],
    queryFn: () => provider.getOrgUnits(),
  });
}

export function useDeliveryVelocity() {
  const provider = useDataProvider();
  const { refreshKey } = useGlobalFilters();

  return useQuery({
    queryKey: ['delivery-velocity', provider.id, refreshKey],
    queryFn: async () => (await provider.getMetrics()).deliveryVelocity,
  });
}

export function useFilterOptions() {
  const provider = useDataProvider();
  const portfolios = useQuery({
    queryKey: ['filter-portfolios', provider.id],
    queryFn: () => provider.getPortfolios(),
  });
  const teams = useQuery({
    queryKey: ['filter-teams', provider.id],
    queryFn: () => provider.getTeams(),
  });
  const products = useQuery({
    queryKey: ['filter-products', provider.id],
    queryFn: () => provider.getProducts(),
  });
  const quarters = useQuery({
    queryKey: ['filter-quarters', provider.id],
    queryFn: () => provider.getQuarters(),
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
  const provider = useDataProvider();

  return useQuery({
    queryKey: ['current-user', provider.id],
    queryFn: () => provider.getCurrentUser(),
  });
}

export function useNotifications() {
  const provider = useDataProvider();
  const { refreshKey } = useGlobalFilters();

  return useQuery({
    queryKey: ['notifications', provider.id, refreshKey],
    queryFn: () => provider.getNotifications(),
  });
}
