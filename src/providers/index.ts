/**
 * Data access abstraction for TPM Control Tower.
 *
 *   DataProvider (interface)
 *     ├─ MockDataProvider   ← active
 *     └─ JiraDataProvider   ← stub for future swap
 *
 * UI and hooks consume data only through DataProvider / useDataProvider().
 */
export type { DataProvider, DataProviderKind } from './DataProvider';
export { MockDataProvider } from './MockDataProvider';
export { JiraDataProvider } from './JiraDataProvider';
export {
  createDataProvider,
  getDataProvider,
  setDataProvider,
  resolveDataProviderKind,
} from './registry';
export { DataProviderHost } from './DataProviderHost';
export { useDataProvider } from './useDataProvider';
