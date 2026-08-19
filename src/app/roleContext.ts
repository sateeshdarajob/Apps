import { createContext } from 'react';
import type { DashboardRole } from '@/types';

export type RoleContextValue = {
  role: DashboardRole;
  setRole: (role: DashboardRole) => void;
};

export const RoleContext = createContext<RoleContextValue | undefined>(undefined);
