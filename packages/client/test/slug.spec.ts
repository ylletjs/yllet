import Client from '../src';
import MockTransport from './mocks/MockTransport';
import expect from 'expect';

const responses = {
  get: {
    posts: [
      { id: 1, title: 'post-1' },
      { id: 2, title: 'post-2' },
      { id: 3, title: 'post-3' }
    ]
  }
};

const transport = new MockTransport(responses);
const endpoint = 'http://wordpress.test/wp-json';
const client = new Client({ transport, endpoint });

describe('Client.slug', () => {
  it('return first post', async () => {
    await client.posts().slug('about');
    expect((transport as any).get.mock.calls[0][0]).toBe(
      `${endpoint}/wp/v2/posts`
    );
  });

  it('has the right params', async () => {
    await client.posts().slug('about', {
      search: 'search'
    });
    expect((transport as any).get.mock.calls[1][1]).toEqual({
      search: 'search',
      per_page: 1,
      slug: 'about'
    });
  });
});
