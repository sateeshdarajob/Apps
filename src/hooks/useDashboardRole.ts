import { useContext } from 'react';
import { RoleContext } from '@/app/roleContext';

export function useDashboardRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useDashboardRole must be used within RoleProvider');
  }
  return context;
}
