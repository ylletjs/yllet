import expect from 'expect';
import Client from '../src';
import MockTransport from '../__mocks__/MockTransport';

const METHODS = {
  get: 'get',
  create: 'post',
  update: 'put',
  delete: 'delete'
};

describe('Client.METHODS', () => {
  Object.keys(METHODS).forEach((method) => {
    const verb = METHODS[method];
    it(`"${method}" calls correct HTTP verb on transport`, () => {
      const transport = new MockTransport();
      const client = new Client({
        endpoint: 'http://wordpress.test/wp-json/',
        transport
      });
      client[method]('products', { foo: 'bar' });
      expect((transport[verb] as any).mock.calls.length).toBe(1);
      expect((transport[verb] as any).mock.calls[0][0]).toBe(
        'http://wordpress.test/wp-json/wp/v2/products'
      );
      expect((transport[verb] as any).mock.calls[0][1]).toEqual({ foo: 'bar' });
    });
  });
});
