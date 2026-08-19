import type { DataProvider, DataProviderKind } from './DataProvider';
import { MockDataProvider } from './MockDataProvider';
import { JiraDataProvider } from './JiraDataProvider';

const providers = {
  mock: () => new MockDataProvider(),
  jira: () => new JiraDataProvider(),
} as const satisfies Record<DataProviderKind, () => DataProvider>;

/** Active provider kind. Override with VITE_DATA_PROVIDER=mock|jira when ready. */
export function resolveDataProviderKind(): DataProviderKind {
  const configured = import.meta.env.VITE_DATA_PROVIDER as string | undefined;
  if (configured === 'jira' || configured === 'mock') return configured;
  return 'mock';
}

export function createDataProvider(kind: DataProviderKind = resolveDataProviderKind()): DataProvider {
  return providers[kind]();
}

/** Process-wide default used before React context mounts (and by thin service facades). */
let activeProvider: DataProvider = createDataProvider('mock');

export function getDataProvider(): DataProvider {
  return activeProvider;
}

export function setDataProvider(provider: DataProvider): void {
  activeProvider = provider;
}
