/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_PROVIDER?: 'mock' | 'jira';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
