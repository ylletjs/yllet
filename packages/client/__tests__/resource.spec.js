import expect from 'expect';
import Client from '../src';
import MockTransport from '../__mocks__/MockTransport';

const transport = new MockTransport();
const endpoint = 'http://wordpress.test/wp-json';
const client = new Client({ transport, endpoint });

describe('Client.resource', () => {
  beforeEach(() => {
    transport.resetMocks();
  });

  it('sets the current path', () => {
    client.resource('products');
    expect(client.options.resource).toBe('products');
  });

  it('has fluent interface', () => {
    const returnValue = client.resource('products');
    expect(returnValue).toBe(client);
  });

  it('restores options after requesting', () => {
    client
      .endpoint('https://woocommerce.com/wp-json')
      .namespace('wc/v3')
      .resource('products');
    expect(client.options.endpoint).toEqual('https://woocommerce.com/wp-json');
    expect(client.options.namespace).toEqual('wc/v3');
    expect(client.options.resource).toEqual('products');

    client.request('post');
    expect(client.options.endpoint).toEqual(endpoint);
    expect(client.options.namespace).toEqual('wp/v2');
    expect(client.options.resource).toEqual('');
  });
});
