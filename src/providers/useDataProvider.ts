import { useContext } from 'react';
import type { DataProvider } from './DataProvider';
import { DataProviderContext } from './dataProviderContext';
import { getDataProvider } from './registry';

/**
 * Access the active DataProvider. Prefer this over importing services or mock JSON.
 * Must be used under DataProviderHost (falls back to registry only if context is missing).
 */
export function useDataProvider(): DataProvider {
  const context = useContext(DataProviderContext);
  return context ?? getDataProvider();
}
