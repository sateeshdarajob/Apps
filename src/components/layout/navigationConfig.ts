import type { NavigationItem } from '@/types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'control-tower',
    label: 'Control Tower',
    path: '/',
    icon: 'dashboard',
  },
  {
    id: 'programs',
    label: 'Programs',
    path: '/programs',
    icon: 'programs',
  },
  {
    id: 'risks',
    label: 'Risks',
    path: '/risks',
    icon: 'risks',
  },
  {
    id: 'dependencies',
    label: 'Dependencies',
    path: '/dependencies',
    icon: 'dependencies',
  },
  {
    id: 'capacity',
    label: 'Capacity',
    path: '/capacity',
    icon: 'capacity',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'settings',
  },
];
