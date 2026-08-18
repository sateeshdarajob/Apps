import type { AppNotification, CurrentUser, Portfolio, Product, Team, FilterOption } from '@/types';
import { PROFILE_AVATAR_INITIALS, PROFILE_DISPLAY_NAME } from '@/utils/profile';

export const portfolios: Portfolio[] = [
  { id: 'pf-growth', name: 'Growth Portfolio' },
  { id: 'pf-platform', name: 'Platform Portfolio' },
  { id: 'pf-reliability', name: 'Reliability Portfolio' },
];

export const teams: Team[] = [
  { id: 'team-identity', name: 'Identity Platform', orgUnitId: 'org-platform' },
  { id: 'team-checkout', name: 'Checkout Experience', orgUnitId: 'org-product' },
  { id: 'team-data-plat', name: 'Data Platform', orgUnitId: 'org-data' },
  { id: 'team-secops', name: 'Security Operations', orgUnitId: 'org-security' },
];

export const products: Product[] = [
  { id: 'prod-identity', name: 'Customer Identity', portfolioId: 'pf-platform' },
  { id: 'prod-checkout', name: 'Checkout', portfolioId: 'pf-growth' },
  { id: 'prod-analytics', name: 'Analytics Hub', portfolioId: 'pf-platform' },
  { id: 'prod-access', name: 'Zero Trust Access', portfolioId: 'pf-reliability' },
];

export const quarters: FilterOption[] = [
  { id: '2026-Q1', label: '2026 Q1' },
  { id: '2026-Q2', label: '2026 Q2' },
  { id: '2026-Q3', label: '2026 Q3' },
  { id: '2026-Q4', label: '2026 Q4' },
  { id: '2025-Q4', label: '2025 Q4' },
];

/** Display profile for the signed-in Control Tower user — keep this name stable. */
export const currentUser: CurrentUser = {
  id: 'user-001',
  name: PROFILE_DISPLAY_NAME,
  email: 'sateesh.kumar.dara@example.com',
  role: 'Technical Program Manager',
  avatarInitials: PROFILE_AVATAR_INITIALS,
};

export const notifications: AppNotification[] = [
  {
    id: 'n-001',
    title: 'RAG change: Data Platform Consolidation',
    body: 'Program moved from Amber to Red due to unfunded capacity.',
    createdAt: '2026-03-18T13:20:00Z',
    read: false,
  },
  {
    id: 'n-002',
    title: 'Dependency at risk',
    body: 'Zero Trust policies needed before identity cutover.',
    createdAt: '2026-03-18T11:05:00Z',
    read: false,
  },
  {
    id: 'n-003',
    title: 'Release window confirmed',
    body: 'Checkout Reliability Program targeting April 30.',
    createdAt: '2026-03-17T16:40:00Z',
    read: true,
  },
];
