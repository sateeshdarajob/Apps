import { useContext } from 'react';
import type { DataProvider } from './DataProvider';
import { DataProviderContext } from './dataProviderContext';
import { getDataProvider } from './registry';

/** Access the active DataProvider. Prefer this over importing services or mock JSON. */
export function useDataProvider(): DataProvider {
  const context = useContext(DataProviderContext);
  if (!context) {
    return getDataProvider();
  }
  return context;
}
