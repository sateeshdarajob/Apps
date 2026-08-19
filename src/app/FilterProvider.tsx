import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AUTO_REFRESH_OPTIONS,
  FilterContext,
  type FilterContextValue,
} from '@/hooks/useGlobalFilters';
import type { AutoRefreshInterval, GlobalFilters } from '@/types';
import {
  CLEARED_FILTERS,
  DEFAULT_FILTERS,
  countActiveFilters,
  loadStoredFilters,
  loadStoredRefresh,
  persistFilters,
  persistRefresh,
} from '@/utils/filterState';

type FilterProviderProps = {
  children: ReactNode;
};

/**
 * Application-wide filter + refresh state.
 * Filters persist across navigation (and reloads) via localStorage.
 */
export function FilterProvider({ children }: FilterProviderProps) {
  const [filters, setFiltersState] = useState<GlobalFilters>(
    () => loadStoredFilters() ?? DEFAULT_FILTERS,
  );
  const [autoRefresh, setAutoRefreshState] = useState<AutoRefreshInterval>(
    () => loadStoredRefresh() ?? 'manual',
  );
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date());
  const [refreshKey, setRefreshKey] = useState(0);

  const setFilters = useCallback((next: Partial<GlobalFilters>) => {
    setFiltersState((prev) => {
      const merged = { ...prev, ...next };
      persistFilters(merged);
      return merged;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    persistFilters(DEFAULT_FILTERS);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(CLEARED_FILTERS);
    persistFilters(CLEARED_FILTERS);
  }, []);

  const setAutoRefresh = useCallback((interval: AutoRefreshInterval) => {
    setAutoRefreshState(interval);
    persistRefresh(interval);
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

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const value = useMemo<FilterContextValue>(
    () => ({
      filters,
      setFilters,
      resetFilters,
      clearFilters,
      activeFilterCount,
      autoRefresh,
      setAutoRefresh,
      lastRefreshedAt,
      refreshNow,
      refreshKey,
    }),
    [
      filters,
      setFilters,
      resetFilters,
      clearFilters,
      activeFilterCount,
      autoRefresh,
      setAutoRefresh,
      lastRefreshedAt,
      refreshNow,
      refreshKey,
    ],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
