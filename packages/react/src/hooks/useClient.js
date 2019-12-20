import Client from '@yllet/client';
import { createContext, useMemo, useContext } from 'react';

const Context = createContext({ client: null });

/**
 * Use client creates a new client.
 *
 * @param {object} options
 * @param {object} transport
 */
export default function useClient(options, transport) {
  const context = useContext(Context);

  if (context.client) {
    return context.client;
  }

  return useMemo(() => {
    return new Client(options, transport);
  }, []);
}
