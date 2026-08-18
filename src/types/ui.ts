import type { ReactNode } from 'react';

export type NavigationItem = {
  id: string;
  label: string;
  path: string;
  icon: string;
  section?: 'primary' | 'secondary';
  children?: NavigationItem[];
};

export type ChartSeriesPoint = {
  label: string;
  value: number;
};

export type NamedSeries = {
  name: string;
  data: ChartSeriesPoint[];
};

export type TableColumn<T> = {
  id: keyof T | string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  render?: (row: T) => ReactNode;
};
