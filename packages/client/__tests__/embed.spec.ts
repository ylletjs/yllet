import expect from 'expect';
import Client from '../src';
import MockTransport from '../__mocks__/MockTransport';

const transport = new MockTransport();
const endpoint = 'http://wordpress.test/wp-json';
const client = new Client({ transport, endpoint });

const params = {
  title: 'Hello World',
  content: 'Welcome to the Wordpress API'
};

describe('Client.embed', () => {
  it('can enable embed mode', () => {
    client.embed().request('get', params);
    expect((transport as any).get.mock.calls[0][1]).toEqual({
      _embed: true,
      ...params
    });
  });

  // it('has fluent interface', () => {
  //   const returnValue = client.embed();
  //   expect(returnValue).toBe(client);
  // });
});
