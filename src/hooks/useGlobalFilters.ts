import { createContext, useContext } from 'react';
import type { AutoRefreshInterval, GlobalFilters } from '@/types';

export { DEFAULT_FILTERS, CLEARED_FILTERS } from '@/utils/filterState';

export const AUTO_REFRESH_OPTIONS: {
  value: AutoRefreshInterval;
  label: string;
  ms: number | null;
}[] = [
  { value: 'manual', label: 'Manual', ms: null },
  { value: '5m', label: '5 min', ms: 5 * 60 * 1000 },
  { value: '15m', label: '15 min', ms: 15 * 60 * 1000 },
  { value: '30m', label: '30 min', ms: 30 * 60 * 1000 },
  { value: '1h', label: '1 hour', ms: 60 * 60 * 1000 },
];

export type FilterContextValue = {
  filters: GlobalFilters;
  setFilters: (next: Partial<GlobalFilters>) => void;
  /** Restore DEFAULT_FILTERS (quarter + date range defaults). */
  resetFilters: () => void;
  /** Clear all dimensions to open lens. */
  clearFilters: () => void;
  activeFilterCount: number;
  autoRefresh: AutoRefreshInterval;
  setAutoRefresh: (interval: AutoRefreshInterval) => void;
  lastRefreshedAt: Date;
  refreshNow: () => void;
  /** Increments on each refresh so consumers can invalidate queries. */
  refreshKey: number;
};

export const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function useGlobalFilters(): FilterContextValue {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useGlobalFilters must be used within FilterProvider');
  }
  return context;
}
