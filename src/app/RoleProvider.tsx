import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { DashboardRole } from '@/types';
import { ROLE_STORAGE_KEY } from '@/utils/filterState';

type RoleContextValue = {
  role: DashboardRole;
  setRole: (role: DashboardRole) => void;
};

export const RoleContext = createContext<RoleContextValue | undefined>(undefined);

function loadRole(): DashboardRole {
  try {
    const raw = localStorage.getItem(ROLE_STORAGE_KEY);
    if (
      raw === 'executive' ||
      raw === 'tpm' ||
      raw === 'engineeringManager' ||
      raw === 'productManager'
    ) {
      return raw;
    }
  } catch {
    // ignore
  }
  return 'tpm';
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<DashboardRole>(() => loadRole());

  const setRole = useCallback((next: DashboardRole) => {
    setRoleState(next);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
