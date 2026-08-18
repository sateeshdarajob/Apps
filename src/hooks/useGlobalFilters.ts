import { createContext, useContext } from 'react';
import type { GlobalFilters } from '@/types';

export const DEFAULT_FILTERS: GlobalFilters = {
  orgUnitId: 'all',
  programId: 'all',
  dateRange: '90d',
};

export type FilterContextValue = {
  filters: GlobalFilters;
  setFilters: (next: Partial<GlobalFilters>) => void;
  resetFilters: () => void;
};

export const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function useGlobalFilters(): FilterContextValue {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useGlobalFilters must be used within FilterProvider');
  }
  return context;
}
