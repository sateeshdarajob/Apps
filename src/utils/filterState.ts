import type { AutoRefreshInterval, GlobalFilters } from '@/types';

export const DEFAULT_FILTERS: GlobalFilters = {
  portfolioId: 'all',
  programId: 'all',
  quarter: '2026-Q1',
  teamId: 'all',
  productId: 'all',
  ragStatus: 'all',
  dateRange: '90d',
};

/** Clear Filters: open all dimensions (except a sensible date range). */
export const CLEARED_FILTERS: GlobalFilters = {
  portfolioId: 'all',
  programId: 'all',
  quarter: 'all',
  teamId: 'all',
  productId: 'all',
  ragStatus: 'all',
  dateRange: '90d',
};

export const FILTER_STORAGE_KEY = 'tpm-control-tower.filters.v1';
export const REFRESH_STORAGE_KEY = 'tpm-control-tower.refresh.v1';
export const ROLE_STORAGE_KEY = 'tpm-control-tower.role.v1';

export function countActiveFilters(filters: GlobalFilters): number {
  let count = 0;
  if (filters.portfolioId !== 'all') count += 1;
  if (filters.programId !== 'all') count += 1;
  if (filters.quarter !== 'all') count += 1;
  if (filters.teamId !== 'all') count += 1;
  if (filters.productId !== 'all') count += 1;
  if (filters.ragStatus !== 'all') count += 1;
  if (filters.dateRange !== DEFAULT_FILTERS.dateRange) count += 1;
  return count;
}

export function loadStoredFilters(): GlobalFilters | null {
  try {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GlobalFilters>;
    return { ...DEFAULT_FILTERS, ...parsed };
  } catch {
    return null;
  }
}

export function persistFilters(filters: GlobalFilters): void {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // ignore quota / private mode
  }
}

export function loadStoredRefresh(): AutoRefreshInterval | null {
  try {
    const raw = localStorage.getItem(REFRESH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { autoRefresh?: AutoRefreshInterval };
    return parsed.autoRefresh ?? null;
  } catch {
    return null;
  }
}

export function persistRefresh(autoRefresh: AutoRefreshInterval): void {
  try {
    localStorage.setItem(REFRESH_STORAGE_KEY, JSON.stringify({ autoRefresh }));
  } catch {
    // ignore
  }
}
