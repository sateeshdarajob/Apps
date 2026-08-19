import { createContext } from 'react';
import type { DataProvider } from './DataProvider';

export const DataProviderContext = createContext<DataProvider | undefined>(undefined);
