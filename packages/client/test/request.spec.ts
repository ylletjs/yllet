import expect from 'expect';
import Client from '../src';
import FormData from 'isomorphic-form-data';
import MockTransport from './mocks/MockTransport';

const transport = new MockTransport();
const endpoint = 'http://wordpress.test/wp-json';
const client = new Client({ transport, endpoint });

const params = {
  title: 'Hello World',
  content: 'Welcome to the Wordpress API'
};

describe('Client.request', () => {
  beforeEach(() => {
    transport.resetMocks();
  });

  it('accepts path as 2nd param', () => {
    client.request('post', 'products');
    expect((transport as any).post.mock.calls[0][0]).toBe(
      `${endpoint}/wp/v2/products`
    );
  });

  it('accepts params as 2nd param', () => {
    client.request('post', params);
    expect((transport as any).post.mock.calls[0][0]).toBe(`${endpoint}/wp/v2`);
    expect((transport as any).post.mock.calls[0][1]).toEqual(params);
  });

  it('handles invalid paths', () => {
    client.request('post', undefined as any);
    expect((transport as any).post.mock.calls[0][0]).toBe(`${endpoint}/wp/v2`);
    client.request('post', 123 as any);
    expect((transport as any).post.mock.calls[1][0]).toBe(
      `${endpoint}/wp/v2/123`
    );
    client.request('post', null as any);
    expect((transport as any).post.mock.calls[2][0]).toBe(`${endpoint}/wp/v2`);
    client.request('post', {});
    expect((transport as any).post.mock.calls[3][0]).toBe(`${endpoint}/wp/v2`);
    client.request('post', 'products/variations/123');
    expect((transport as any).post.mock.calls[4][0]).toBe(
      `${endpoint}/wp/v2/products/variations/123`
    );
  });

  it('makes verb lowercase', () => {
    client.request('POST', undefined as any);
    expect((transport as any).post.mock.calls[0][0]).toBe(`${endpoint}/wp/v2`);
  });

  it('merges global params', () => {
    client.params = { a: '1', b: '2' };
    client.request('post', params);
    expect((transport as any).post.mock.calls[0][1]).toEqual({
      ...client.params,
      ...params
    });
  });

  it('converts request params to snake case', () => {
    client.params = { weLikeCamels: '1', andClimbingHills: '2' };
    client.request('post', { andGentleWavesLikeThis: '3' });
    expect((transport as any).post.mock.calls[0][1]).toEqual({
      weLikeCamels: '1',
      andClimbingHills: '2',
      and_gentle_waves_like_this: '3'
    });
  });

  it('can send a file', () => {
    const formData = new FormData();
    client.formData = formData;
    client.params = { a: '1', b: '2' };
    client.request('post', params);

    const result = (transport as any).post.mock.calls[0][1];
    expect(result instanceof FormData).toEqual(true);
  });

  it('merges global request config', () => {
    client.options.config = { a: '1', b: '2' };
    client.request('post');
    expect((transport as any).post.mock.calls[0][2]).toEqual({
      ...client.options.config
    });
  });
});
