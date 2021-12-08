import { renderHook } from '@testing-library/react-hooks'
import { useClient } from '../src';

describe('useClient', () => {
  it('test useClient', () => {
    const endpoint = 'https://demo.wp-api.org/wp-json';
    const { result } = renderHook(() => useClient({ endpoint }));
    expect(result.current.options.endpoint).toBe(endpoint);
  });
});
