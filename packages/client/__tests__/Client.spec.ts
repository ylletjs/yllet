import Client from '../src';
import MockTransport from '../__mocks__/MockTransport';
import expect from 'expect';

const transport = new MockTransport();
const endpoint = 'http://wordpress.test/wp-json';
const client = new Client({ transport, endpoint });
const defaultOptions = {
  endpoint: '',
  namespace: 'wp/v2',
  nonce: '',
  config: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  resource: '',
  restore: true
};

describe('Client', () => {
  beforeEach(() => {
    transport.resetMocks();
  });

  it('sets transport property', () => {
    expect(client.transport).toBe(transport);
  });

  it('throws error when missing transport', () => {
    try {
      new Client({ transport: undefined });
    } catch (error: any) {
      expect(error instanceof TypeError).toBe(true);
      expect(error.message).toBe('Transport is required option, none was set.');
    }
  });

  it('has default options', () => {
    const ylletClient = new Client({ transport });
    expect(ylletClient.options).toEqual(defaultOptions);
  });

  it('handle bad options input', () => {
    const ylletClient = new Client(undefined);
    expect(ylletClient.options).toEqual(defaultOptions);
  });

  it('has nonce header', () => {
    const ylletClient = new Client({
      nonce: 'XYZ'
    });
    expect(ylletClient.options.config.headers['X-WP-Nonce']).toEqual('XYZ');
  });

  it('just endpoint option', () => {
    const ylletClient = new Client(endpoint);
    expect(ylletClient.options).toEqual({
      ...defaultOptions,
      endpoint: endpoint
    });
  });

  it('bad options input', () => {
    const ylletClient = new Client(undefined);
    expect(ylletClient.options).toEqual(defaultOptions);
  });

  it('merges options', () => {
    const ylletClient = new Client({
      transport,
      headers: {
        'X-Test': 'Test'
      },
      endpoint: 'https://wordpress.test/wp-json',
      config: {
        foo: 'bar'
      }
    });
    expect(ylletClient.options).toEqual({
      endpoint: 'https://wordpress.test/wp-json',
      namespace: 'wp/v2',
      nonce: '',
      config: {
        foo: 'bar',
        headers: {
          'Content-Type': 'application/json',
          'X-Test': 'Test'
        }
      },
      resource: '',
      restore: true
    });
  });

  it('has HTTP methods', () => {
    expect(typeof client.get).toBe('function');
    expect(typeof client.create).toBe('function');
    expect(typeof client.update).toBe('function');
    expect(typeof client.delete).toBe('function');
  });

  it('has API Resource methods', () => {
    [
      'categories',
      'comments',
      'media',
      'statuses',
      'pages',
      'posts',
      'settings',
      'tags',
      'taxonomies',
      'types',
      'users',
      'search'
    ].forEach((method) => {
      client[method]();
      expect(client.options.resource).toBe(method);
    });
  });
});
