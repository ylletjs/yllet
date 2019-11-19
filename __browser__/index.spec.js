import Client from '@yllet/client';

// setup

// const transport = new MockTransport();
const endpoint = 'http://wordpress.test/wp-json';
const client = new Client({ transport: {}, endpoint });

// describe

describe('Client', () => {
  beforeEach(() => {
    transport.resetMocks();
  });

  test('it sets transport property', () => {
    expect(client.transport).to.equal(transport);
  });

  test('it throws error when missing transport', () => {
    try {
      new Client({ transport: undefined });
    } catch (error) {
      expect(error instanceof TypeError).to.equal(true);
      expect(error.message).to.equal('Transport is required option, none was set.');
    }
  });
});
