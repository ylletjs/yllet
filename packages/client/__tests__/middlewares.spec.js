import Client from '../src';
import MockTransport from '../__mocks__/MockTransport';
import expect from 'expect';

const transport = new MockTransport();
const endpoint = 'http://wordpress.test/wp-json';
const client = new Client({ transport, endpoint });
const defaultOptions = {
  endpoint: '',
  middlewares: [],
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

const middlewareOne = (client, next) => {
  client.header('X-Foo', 'Bar');
  return next();
};

const middlewareTwo = async (client, next) => {
  jest.useFakeTimers();
  setTimeout(() => {
    client.header('X-Foo', 'Bar');
    return next();
  }, 1000);
  jest.runAllTimers();
};

describe('Middlewares', () => {
  beforeEach(() => {
    transport.resetMocks();
  });

  it('default middleware property', () => {
    expect(client.middlewares).toEqual([]);
  });

  it('add middlewares as option', () => {
    const ylletClient = new Client({ middlewares: [middlewareOne] });
    expect(ylletClient.middlewares).toEqual([middlewareOne]);
  });

  it('add middlewares with use', () => {
    const ylletClient = new Client();
    expect(ylletClient.middlewares).toEqual([]);

    ylletClient.use(middlewareOne);
    expect(ylletClient.middlewares).toEqual([middlewareOne]);

    ylletClient.use([middlewareOne]);
    expect(ylletClient.middlewares).toEqual([middlewareOne, middlewareOne]);
  });

  it('run middleware one', () => {
    const ylletClient = new Client({ middlewares: [middlewareOne], transport });
    expect(transport.get.mock.calls).toEqual([]);

    ylletClient.posts().get();
    expect(transport.get.mock.calls[0][2].headers['X-Foo']).toBe('Bar');

    ylletClient.request('get', 'products');
    expect(transport.get.mock.calls[1][2].headers['X-Foo']).toBe('Bar');
  });

  it('run middleware two', async () => {
    const ylletClient = new Client({ middlewares: [middlewareTwo], transport });
    expect(transport.get.mock.calls).toEqual([]);

    await ylletClient.posts().get();
    expect(transport.get.mock.calls[0][2].headers['X-Foo']).toBe('Bar');

    ylletClient.request('get', 'products').then(() => {
      expect(transport.get.mock.calls[1][2].headers['X-Foo']).toBe('Bar');
    });
  });
});
