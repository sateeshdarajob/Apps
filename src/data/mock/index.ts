/**
 * Central mock data barrel. UI and services should import from here
 * (or via services) rather than embedding business data in components.
 */
export { orgUnits, people, programs, risks, dependencies, portfolioKpis } from './programs';

export { deliveryVelocityTrend, ragDistribution, capacityByOrg } from './charts';
