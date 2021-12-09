import React from 'react';
import type { ContextValue, ProviderProps } from './provider.types';

export const Context = React.createContext<ContextValue>({ client: null });

export const Provider = ({ client, children }: ProviderProps) => (
  <Context.Provider value={{ client }}>{children}</Context.Provider>
);
