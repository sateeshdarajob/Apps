import type {
  OrgUnit,
  Person,
  Portfolio,
  Product,
  Team,
  FilterOption,
  AppNotification,
  CurrentUser,
} from '@/types';
import { PROFILE_AVATAR_INITIALS, PROFILE_DISPLAY_NAME } from '@/utils/profile';

export const orgUnits: OrgUnit[] = [
  { id: 'org-platform', name: 'Platform Engineering' },
  { id: 'org-product', name: 'Product Delivery' },
  { id: 'org-data', name: 'Data & Analytics' },
  { id: 'org-security', name: 'Security & Compliance' },
];

export const portfolios: Portfolio[] = [
  {
    id: 'pf-growth',
    name: 'Growth Portfolio',
    description: 'Customer-facing growth and conversion initiatives.',
  },
  {
    id: 'pf-platform',
    name: 'Platform Portfolio',
    description: 'Shared platforms, identity, and data foundations.',
  },
  {
    id: 'pf-reliability',
    name: 'Reliability Portfolio',
    description: 'Security, resiliency, and operational excellence.',
  },
];

export const teams: Team[] = [
  {
    id: 'team-identity',
    name: 'Identity Platform',
    orgUnitId: 'org-platform',
    portfolioId: 'pf-platform',
    productId: 'prod-identity',
    managerId: 'p-002',
    location: 'Austin',
    skillFocus: 'AuthN / AuthZ',
  },
  {
    id: 'team-checkout',
    name: 'Checkout Experience',
    orgUnitId: 'org-product',
    portfolioId: 'pf-growth',
    productId: 'prod-checkout',
    managerId: 'p-003',
    location: 'Seattle',
    skillFocus: 'Payments / UX',
  },
  {
    id: 'team-data-plat',
    name: 'Data Platform',
    orgUnitId: 'org-data',
    portfolioId: 'pf-platform',
    productId: 'prod-analytics',
    managerId: 'p-002',
    location: 'Chicago',
    skillFocus: 'Pipelines / Warehouse',
  },
  {
    id: 'team-secops',
    name: 'Security Operations',
    orgUnitId: 'org-security',
    portfolioId: 'pf-reliability',
    productId: 'prod-access',
    managerId: 'p-004',
    location: 'Remote',
    skillFocus: 'Zero Trust / IAM',
  },
];

export const products: Product[] = [
  { id: 'prod-identity', name: 'Customer Identity', portfolioId: 'pf-platform' },
  { id: 'prod-checkout', name: 'Checkout', portfolioId: 'pf-growth' },
  { id: 'prod-analytics', name: 'Analytics Hub', portfolioId: 'pf-platform' },
  { id: 'prod-access', name: 'Zero Trust Access', portfolioId: 'pf-reliability' },
];

export const people: Person[] = [
  {
    id: 'p-001',
    name: PROFILE_DISPLAY_NAME,
    email: 'sateesh.kumar.dara@example.com',
    role: 'Technical Program Manager',
    avatarInitials: PROFILE_AVATAR_INITIALS,
    teamId: 'team-identity',
  },
  {
    id: 'p-002',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    role: 'Engineering Manager',
    avatarInitials: 'JL',
    teamId: 'team-data-plat',
  },
  {
    id: 'p-003',
    name: 'Sam Okonkwo',
    email: 'sam.okonkwo@example.com',
    role: 'Product Manager',
    avatarInitials: 'SO',
    teamId: 'team-checkout',
  },
  {
    id: 'p-004',
    name: 'Morgan Chen',
    email: 'morgan.chen@example.com',
    role: 'Director of Engineering',
    avatarInitials: 'MC',
    teamId: 'team-secops',
  },
  {
    id: 'p-005',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    role: 'VP Engineering',
    avatarInitials: 'PN',
  },
  {
    id: 'p-006',
    name: 'Chris Alvarez',
    email: 'chris.alvarez@example.com',
    role: 'Business Owner',
    avatarInitials: 'CA',
  },
];

export const personById = Object.fromEntries(people.map((person) => [person.id, person])) as Record<
  string,
  Person
>;

export const teamById = Object.fromEntries(teams.map((team) => [team.id, team])) as Record<
  string,
  Team
>;

export const quarters: FilterOption[] = [
  { id: '2026-Q1', label: '2026 Q1' },
  { id: '2026-Q2', label: '2026 Q2' },
  { id: '2026-Q3', label: '2026 Q3' },
  { id: '2026-Q4', label: '2026 Q4' },
  { id: '2025-Q4', label: '2025 Q4' },
];

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
    priority: 'critical',
    rag: 'red',
  },
  {
    id: 'n-002',
    title: 'Dependency at risk',
    body: 'Zero Trust policies needed before identity cutover.',
    createdAt: '2026-03-18T11:05:00Z',
    read: false,
    priority: 'high',
    rag: 'amber',
  },
  {
    id: 'n-003',
    title: 'Release window confirmed',
    body: 'Checkout Reliability Program targeting April 30.',
    createdAt: '2026-03-17T16:40:00Z',
    read: true,
    priority: 'medium',
    rag: 'green',
  },
];
