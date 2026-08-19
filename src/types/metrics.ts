import type { ChartSeriesPoint, NamedSeries } from './ui';
import type { Kpi } from './kpi';

/** Aggregated portfolio metrics returned by DataProvider.getMetrics(). */
export type PortfolioMetrics = {
  kpis: Kpi[];
  deliveryVelocity: ChartSeriesPoint[];
  /** Label/value series (Green/Amber/Red). Status-aware mapping can be derived by label. */
  ragDistribution: ChartSeriesPoint[];
  capacityByOrg: NamedSeries[];
};
