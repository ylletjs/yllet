import Client from '@yllet/client';
import type { Options } from '@yllet/client';
import { useMemo, useContext } from 'react';
import { Context } from './provider';

/**
 * Use client creates a new client.
 *
 * @param {object} options
 */
const useClient = (options: string | Options = {}) => {
  const context = useContext(Context);

  if (context.client) {
    return context.client;
  }

  return useMemo(() => new Client(options), []);
};

export default useClient;
