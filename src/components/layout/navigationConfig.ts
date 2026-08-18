import type { NavigationItem } from '@/types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'overview', label: 'Overview', path: '/', icon: 'overview', section: 'primary' },
  { id: 'delivery', label: 'Delivery', path: '/delivery', icon: 'delivery', section: 'primary' },
  { id: 'roadmap', label: 'Roadmap', path: '/roadmap', icon: 'roadmap', section: 'primary' },
  {
    id: 'dependencies',
    label: 'Dependencies',
    path: '/dependencies',
    icon: 'dependencies',
    section: 'primary',
  },
  { id: 'risks', label: 'Risks', path: '/risks', icon: 'risks', section: 'primary' },
  { id: 'releases', label: 'Releases', path: '/releases', icon: 'releases', section: 'primary' },
  {
    id: 'incidents',
    label: 'Incidents',
    path: '/incidents',
    icon: 'incidents',
    section: 'primary',
  },
  {
    id: 'resources',
    label: 'Resources',
    path: '/resources',
    icon: 'resources',
    section: 'primary',
  },
  { id: 'metrics', label: 'Metrics', path: '/metrics', icon: 'metrics', section: 'primary' },
  {
    id: 'decisions',
    label: 'Decisions',
    path: '/decisions',
    icon: 'decisions',
    section: 'primary',
  },
  { id: 'settings', label: 'Settings', path: '/settings', icon: 'settings', section: 'secondary' },
];

export function resolveNavigationItem(pathname: string): NavigationItem | undefined {
  if (pathname.startsWith('/programs/')) {
    return {
      id: 'program-detail',
      label: 'Program Detail',
      path: pathname,
      icon: 'roadmap',
      section: 'primary',
    };
  }

  return NAVIGATION_ITEMS.find((item) =>
    item.path === '/' ? pathname === '/' : pathname.startsWith(item.path),
  );
}
