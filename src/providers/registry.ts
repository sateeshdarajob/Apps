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

export function createDataProvider(
  kind: DataProviderKind = resolveDataProviderKind(),
): DataProvider {
  return providers[kind]();
}

/**
 * Process-wide default for thin service facades.
 * Lazily initialized so DataProviderHost does not create a duplicate instance on boot.
 */
let activeProvider: DataProvider | null = null;

export function getDataProvider(): DataProvider {
  if (!activeProvider) {
    activeProvider = createDataProvider('mock');
  }
  return activeProvider;
}

export function setDataProvider(provider: DataProvider): void {
  activeProvider = provider;
}
