/**
 * Central mock data barrel.
 * Import only from MockDataProvider (or tests) — UI/hooks must use DataProvider.
 */

export {
  orgUnits,
  portfolios,
  teams,
  products,
  people,
  personById,
  teamById,
  quarters,
  currentUser,
  notifications,
} from './org';

export { milestones } from './milestones';
export { dependencies } from './dependencies';
export { risks } from './risks';
export { releases } from './releases';
export { incidents } from './incidents';
export { decisions } from './decisions';
export { businessOutcomes } from './businessOutcomes';
export { portfolioKpis } from './kpis';
export { roadmapItems } from './roadmap';
export { sprints } from './sprints';
export { defects } from './defects';
export { capacities } from './capacity';
export { programs } from './programs';
export { deliveryPeriodMetrics, workItemAging } from './delivery';
export { deliveryVelocityTrend, ragDistribution, capacityByOrg } from './charts';
