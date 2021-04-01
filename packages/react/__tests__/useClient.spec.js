import React from 'react';
import { useClient } from '../src';

jest.mock('react', () => {
  const ActualReact = jest.requireActual('react');
  return {
    ...ActualReact,
    useContext: () => ({}),
    useMemo: (fn) => fn()
  };
});

describe('useClient', () => {
  it('test useClient', () => {
    const endpoint = 'https://demo.wp-api.org/wp-json';
    const client = useClient({ endpoint });

    expect(client.options.endpoint).toBe(endpoint);
  });
});
