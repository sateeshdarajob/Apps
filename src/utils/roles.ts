import type { DashboardRole, OverviewSectionId } from '@/types';
import type { NavigationItem } from '@/types';

/** Navigation ids visible per role (Settings always available). */
const ROLE_NAV_IDS: Record<DashboardRole, string[]> = {
  executive: [
    'overview',
    'risks',
    'dependencies',
    'decisions',
    'releases',
    'metrics',
    'settings',
  ],
  tpm: [
    'overview',
    'delivery',
    'dependencies',
    'risks',
    'roadmap',
    'resources',
    'incidents',
    'decisions',
    'releases',
    'metrics',
    'settings',
  ],
  engineeringManager: [
    'overview',
    'delivery',
    'resources',
    'metrics',
    'incidents',
    'dependencies',
    'settings',
  ],
  productManager: [
    'overview',
    'roadmap',
    'releases',
    'metrics',
    'decisions',
    'delivery',
    'settings',
  ],
};

const ROLE_OVERVIEW_SECTIONS: Record<DashboardRole, OverviewSectionId[]> = {
  executive: [
    'executiveActions',
    'kpis',
    'portfolioHealth',
    'businessOutcomes',
    'programHealthTable',
    'risks',
    'blockers',
    'decisions',
    'releases',
  ],
  tpm: [
    'executiveActions',
    'kpis',
    'portfolioHealth',
    'programHealthTable',
    'milestones',
    'blockers',
    'risks',
    'delivery',
    'dependencies',
    'roadmap',
    'resources',
    'incidents',
    'decisions',
    'releases',
  ],
  engineeringManager: [
    'executiveActions',
    'kpis',
    'portfolioHealth',
    'delivery',
    'resources',
    'quality',
    'incidents',
    'blockers',
    'dependencies',
  ],
  productManager: [
    'executiveActions',
    'kpis',
    'roadmap',
    'features',
    'businessOutcomes',
    'releases',
    'scope',
    'adoption',
    'decisions',
  ],
};

export function navigationForRole(
  items: NavigationItem[],
  role: DashboardRole,
): NavigationItem[] {
  const allowed = new Set(ROLE_NAV_IDS[role]);
  return items.filter((item) => allowed.has(item.id));
}

export function overviewSectionsForRole(role: DashboardRole): Set<OverviewSectionId> {
  return new Set(ROLE_OVERVIEW_SECTIONS[role]);
}

export function roleShowsSection(role: DashboardRole, section: OverviewSectionId): boolean {
  return overviewSectionsForRole(role).has(section);
}
