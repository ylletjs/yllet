import expect from 'expect';
import Client from '../src';
import MockTransport from '../__mocks__/MockTransport';

// setup

const transport = new MockTransport();
const endpoint = 'http://wordpress.test/wp-json';
const client = new Client({ transport, endpoint });

// describe

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
      .endpoint('https://foo.com/wp-json')
      .namespace('foo/v3')
      .resource('foobies');
    expect(client.options.endpoint).toEqual('https://foo.com/wp-json');
    expect(client.options.namespace).toEqual('foo/v3');
    expect(client.options.resource).toEqual('foobies');

    client.request('post');
    expect(client.options.endpoint).toEqual(endpoint);
    expect(client.options.namespace).toEqual('wp/v2');
    expect(client.options.resource).toEqual('');
  });

});
