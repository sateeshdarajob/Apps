/** Dashboard persona used to tailor navigation and Overview sections. */
export type DashboardRole = 'executive' | 'tpm' | 'engineeringManager' | 'productManager';

export type OverviewSectionId =
  | 'executiveActions'
  | 'kpis'
  | 'portfolioHealth'
  | 'businessOutcomes'
  | 'programHealthTable'
  | 'milestones'
  | 'blockers'
  | 'risks'
  | 'releases'
  | 'decisions'
  | 'delivery'
  | 'dependencies'
  | 'roadmap'
  | 'resources'
  | 'incidents'
  | 'quality'
  | 'features'
  | 'scope'
  | 'adoption';

export const DASHBOARD_ROLE_OPTIONS: { value: DashboardRole; label: string }[] = [
  { value: 'executive', label: 'Executive' },
  { value: 'tpm', label: 'TPM' },
  { value: 'engineeringManager', label: 'Engineering Manager' },
  { value: 'productManager', label: 'Product Manager' },
];
