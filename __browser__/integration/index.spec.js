import Client from '@yllet/client';
import { expect } from 'chai';

// setup

const endpoint = 'http://wordpress.test/wp-json';
const client = new Client({ transport: {}, endpoint });
// describe

describe('Client', () => {
  it('it sets transport property', () => {
    expect(client.transport).to.equal({});
    expect(false).to.equal(true);
  });
});
