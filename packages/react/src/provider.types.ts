import { ReactNode } from 'react';
import Client from '@yllet/client';
export interface ContextValue {
  client: Client | null;
}

export type ProviderProps = {
  client: Client;
  children: ReactNode;
};
