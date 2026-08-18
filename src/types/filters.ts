import type { AutoRefreshInterval, DateRangeValue, RagStatus } from './common';

/**
 * Shared global filter state consumed by every dashboard route.
 * Filtering utilities in `src/utils/filters` apply this shape consistently.
 */
export type GlobalFilters = {
  portfolioId: string | 'all';
  programId: string | 'all';
  quarter: string | 'all';
  teamId: string | 'all';
  productId: string | 'all';
  ragStatus: RagStatus | 'all';
  dateRange: DateRangeValue;
};

export type { AutoRefreshInterval, DateRangeValue };
