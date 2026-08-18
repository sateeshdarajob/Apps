import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_FILTERS, FilterContext, type FilterContextValue } from '@/hooks/useGlobalFilters';
import type { GlobalFilters } from '@/types';

type FilterProviderProps = {
  children: ReactNode;
};

export function FilterProvider({ children }: FilterProviderProps) {
  const [filters, setFiltersState] = useState<GlobalFilters>(DEFAULT_FILTERS);

  const setFilters = useCallback((next: Partial<GlobalFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const value = useMemo<FilterContextValue>(
    () => ({ filters, setFilters, resetFilters }),
    [filters, setFilters, resetFilters],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
