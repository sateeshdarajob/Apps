import type { ChartSeriesPoint, NamedSeries } from '@/types';

export const deliveryVelocityTrend: ChartSeriesPoint[] = [
  { label: 'Oct', value: 42 },
  { label: 'Nov', value: 48 },
  { label: 'Dec', value: 39 },
  { label: 'Jan', value: 51 },
  { label: 'Feb', value: 55 },
  { label: 'Mar', value: 49 },
];

export const ragDistribution: ChartSeriesPoint[] = [
  { label: 'Green', value: 2 },
  { label: 'Amber', value: 1 },
  { label: 'Red', value: 1 },
];

export const capacityByOrg: NamedSeries[] = [
  {
    name: 'Allocated',
    data: [
      { label: 'Platform', value: 18 },
      { label: 'Product', value: 22 },
      { label: 'Data', value: 12 },
      { label: 'Security', value: 9 },
    ],
  },
  {
    name: 'Available',
    data: [
      { label: 'Platform', value: 4 },
      { label: 'Product', value: 3 },
      { label: 'Data', value: 2 },
      { label: 'Security', value: 5 },
    ],
  },
];
