import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AUTO_REFRESH_OPTIONS,
  DEFAULT_FILTERS,
  FilterContext,
  type FilterContextValue,
} from '@/hooks/useGlobalFilters';
import type { AutoRefreshInterval, GlobalFilters } from '@/types';

type FilterProviderProps = {
  children: ReactNode;
};

/**
 * Application-wide filter + refresh state.
 * All dashboard routes should read filters via useGlobalFilters().
 */
export function FilterProvider({ children }: FilterProviderProps) {
  const [filters, setFiltersState] = useState<GlobalFilters>(DEFAULT_FILTERS);
  const [autoRefresh, setAutoRefresh] = useState<AutoRefreshInterval>('manual');
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date());
  const [refreshKey, setRefreshKey] = useState(0);

  const setFilters = useCallback((next: Partial<GlobalFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refreshNow = useCallback(() => {
    setLastRefreshedAt(new Date());
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const option = AUTO_REFRESH_OPTIONS.find((item) => item.value === autoRefresh);
    if (!option?.ms) return undefined;

    const timer = window.setInterval(() => {
      setLastRefreshedAt(new Date());
      setRefreshKey((prev) => prev + 1);
    }, option.ms);

    return () => window.clearInterval(timer);
  }, [autoRefresh]);

  const value = useMemo<FilterContextValue>(
    () => ({
      filters,
      setFilters,
      resetFilters,
      autoRefresh,
      setAutoRefresh,
      lastRefreshedAt,
      refreshNow,
      refreshKey,
    }),
    [filters, setFilters, resetFilters, autoRefresh, lastRefreshedAt, refreshNow, refreshKey],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
