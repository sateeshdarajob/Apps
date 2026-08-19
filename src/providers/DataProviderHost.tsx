import { useMemo, type ReactNode } from 'react';
import type { DataProvider, DataProviderKind } from './DataProvider';
import { DataProviderContext } from './dataProviderContext';
import {
  createDataProvider,
  resolveDataProviderKind,
  setDataProvider,
} from './registry';

type DataProviderHostProps = {
  children: ReactNode;
  /** Force a provider kind (defaults to env / mock). */
  kind?: DataProviderKind;
  /** Inject a custom instance (tests). */
  provider?: DataProvider;
};

/**
 * Supplies the active DataProvider to the React tree.
 * UI/hooks must use `useDataProvider()` — never import mock JSON.
 */
export function DataProviderHost({ children, kind, provider }: DataProviderHostProps) {
  const value = useMemo(() => {
    const next = provider ?? createDataProvider(kind ?? resolveDataProviderKind());
    setDataProvider(next);
    return next;
  }, [kind, provider]);

  return <DataProviderContext.Provider value={value}>{children}</DataProviderContext.Provider>;
}
