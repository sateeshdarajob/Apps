/**
 * Central mock data barrel. UI and services should import from here
 * (or via services) rather than embedding business data in components.
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
export { deliveryVelocityTrend, ragDistribution, capacityByOrg } from './charts';
