import type { GlobalFilters } from '@/types';
import { DATE_RANGE_OPTIONS, RAG_FILTER_OPTIONS, titleCase } from './format';
import { DEFAULT_FILTERS } from './filterState';

export function describeActiveFilters(
  filters: GlobalFilters,
  labels: {
    portfolios: { id: string; name: string }[];
    programs: { id: string; code?: string; name: string }[];
    teams: { id: string; name: string }[];
    products: { id: string; name: string }[];
    quarters: { id: string; label: string }[];
  },
): { key: keyof GlobalFilters; label: string; value: string }[] {
  const chips: { key: keyof GlobalFilters; label: string; value: string }[] = [];

  if (filters.portfolioId !== 'all') {
    chips.push({
      key: 'portfolioId',
      label: 'Portfolio',
      value:
        labels.portfolios.find((item) => item.id === filters.portfolioId)?.name ??
        filters.portfolioId,
    });
  }
  if (filters.programId !== 'all') {
    const program = labels.programs.find((item) => item.id === filters.programId);
    chips.push({
      key: 'programId',
      label: 'Program',
      value: program ? `${program.code ?? ''} ${program.name}`.trim() : filters.programId,
    });
  }
  if (filters.quarter !== 'all') {
    chips.push({
      key: 'quarter',
      label: 'Quarter',
      value: labels.quarters.find((item) => item.id === filters.quarter)?.label ?? filters.quarter,
    });
  }
  if (filters.teamId !== 'all') {
    chips.push({
      key: 'teamId',
      label: 'Team',
      value: labels.teams.find((item) => item.id === filters.teamId)?.name ?? filters.teamId,
    });
  }
  if (filters.productId !== 'all') {
    chips.push({
      key: 'productId',
      label: 'Product',
      value:
        labels.products.find((item) => item.id === filters.productId)?.name ?? filters.productId,
    });
  }
  if (filters.ragStatus !== 'all') {
    chips.push({
      key: 'ragStatus',
      label: 'RAG',
      value:
        RAG_FILTER_OPTIONS.find((item) => item.value === filters.ragStatus)?.label ??
        titleCase(filters.ragStatus),
    });
  }
  if (filters.dateRange !== DEFAULT_FILTERS.dateRange) {
    chips.push({
      key: 'dateRange',
      label: 'Date Range',
      value:
        DATE_RANGE_OPTIONS.find((item) => item.value === filters.dateRange)?.label ??
        filters.dateRange,
    });
  }

  return chips;
}
