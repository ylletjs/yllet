import Client from '../src';
import MockTransport from '../__mocks__/MockTransport';
import expect from 'expect';

const responses = {
  get: {
    posts: {}
  }
};
const transport = new MockTransport(responses);
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
  if (typeof jest !== 'undefined') {
    jest.useFakeTimers();
    setTimeout(() => {
      client.header('X-Foo', 'Bar');
      return next();
    }, 1000);
    jest.runAllTimers();
  } else {
    await new Promise(r => setTimeout(r, 1000));
    client.header('X-Foo', 'Bar');
    return next();
  }
};

const middlewareThree = (client, next) => {
  client
    .endpoint('https://woocommerce.com/wp-json')
    .namespace('wc/v3')
    .resource('products');
  next();
};

class CustomTransport extends MockTransport {}

const middlewareFour = (client, next) => {
  client.transport = new CustomTransport();
  next();
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

  it('run middleware one', async () => {
    const ylletClient = new Client({
      headers: { 'X-Requested-With': 'Yllet' },
      middlewares: [middlewareOne],
      transport
    });
    expect(transport.get.mock.calls).toEqual([]);

    ylletClient
      .posts()
      .get()
      .then(res => {
        expect(res).toBe(responses.get);
        expect(transport.get.mock.calls[0][0]).toBe('/wp/v2/posts');
        expect(transport.get.mock.calls[0][2].headers['X-Requested-With']).toBe(
          'Yllet'
        );
        expect(transport.get.mock.calls[0][2].headers['X-Foo']).toBe('Bar');
      });

    ylletClient
      .posts()
      .get()
      .then(res => {
        expect(res).toBe(responses.get);
        expect(transport.get.mock.calls[1][0]).toBe('/wp/v2/posts');
        expect(transport.get.mock.calls[1][2].headers['X-Requested-With']).toBe(
          'Yllet'
        );
        expect(transport.get.mock.calls[1][2].headers['X-Foo']).toBe('Bar');
      });
  });

  it('run middleware two', async () => {
    const ylletClient = new Client({
      headers: { 'X-Requested-With': 'Yllet' },
      middlewares: [middlewareTwo],
      transport
    });
    expect(transport.get.mock.calls).toEqual([]);

    if (typeof jest !== 'undefined') {
      const res = await ylletClient.posts().get();
      expect(res).toBe(responses.get);
      expect(transport.get.mock.calls[0][0]).toBe('/wp/v2/posts');
      expect(transport.get.mock.calls[0][2].headers['X-Requested-With']).toBe(
        'Yllet'
      );
      expect(transport.get.mock.calls[0][2].headers['X-Foo']).toBe('Bar');
    }

    ylletClient
      .posts()
      .get()
      .then(res => {
        expect(res).toBe(responses.get);
        expect(transport.get.mock.calls[1][0]).toBe('/wp/v2/posts');
        expect(transport.get.mock.calls[1][2].headers['X-Requested-With']).toBe(
          'Yllet'
        );
        expect(transport.get.mock.calls[1][2].headers['X-Foo']).toBe('Bar');
      });
  });

  it('run middleware three', async () => {
    const ylletClient = new Client({
      headers: { 'X-Requested-With': 'Yllet' },
      middlewares: [middlewareThree],
      restore: false,
      transport
    });
    expect(transport.get.mock.calls).toEqual([]);

    ylletClient
      .posts()
      .get()
      .then(res => {
        expect(res).toBe(responses.get);
        expect(transport.get.mock.calls[0][0]).toBe('/wp/v2/posts');
        expect(ylletClient.options.endpoint).toBe('');
        expect(ylletClient.options.namespace).toBe('wp/v2');
        expect(ylletClient.options.resource).toBe('posts');
      });
  });

  it('run middleware four', async () => {
    const ylletClient = new Client({
      headers: { 'X-Requested-With': 'Yllet' },
      middlewares: [middlewareFour],
      restore: false,
      transport
    });

    expect(transport.get.mock.calls).toEqual([]);
    expect(ylletClient.transport).toBeInstanceOf(MockTransport);

    ylletClient
      .posts()
      .get()
      .then(res => {
        expect(res).toBe(responses.get);
        console.log(ylletClient.transport);
        expect(ylletClient.transport).toBeInstanceOf(CustomTransport);
      });
  });
});
