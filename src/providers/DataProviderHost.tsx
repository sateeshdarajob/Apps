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
  const value = useMemo(
    () => provider ?? createDataProvider(kind ?? resolveDataProviderKind()),
    [kind, provider],
  );

  // Mirror into the module registry during render (idempotent) so service facades
  // see the same instance as context before children run — avoids a layout-effect race.
  setDataProvider(value);

  return <DataProviderContext.Provider value={value}>{children}</DataProviderContext.Provider>;
}
