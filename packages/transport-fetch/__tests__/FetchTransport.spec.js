import base64 from 'base-64';
import FormData from 'form-data';
import FetchTransport from '../src';
import HTTPError from '../src/HTTPError';

// setup

const transport = new FetchTransport();

const verbs = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

function resetMocks() {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify({ data: { mock: 'response' } }));
}

// describe

describe('request calls', () => {
  verbs.forEach(verb => {
    test(`${verb} calls fetch once`, () => {
      resetMocks();
      transport.request(verb, 'https://wp.com/wp-json');
      expect(fetch.mock.calls.length).toEqual(1);
    });
  });
});

describe('verbs', () => {
  verbs.forEach(verb => {
    test(`${verb} sends correct http verb`, () => {
      resetMocks();
      transport.request(verb, 'https://wp.com/wp-json');
      expect(fetch.mock.calls[0][1].method).toEqual(verb);
    });
  });
});

describe('url', () => {
  verbs.forEach(verb => {
    test(`${verb} calls correct url`, () => {
      resetMocks();
      transport.request(verb, 'https://wp.com/wp-json');
      expect(fetch.mock.calls[0][0]).toEqual('https://wp.com/wp-json');
    });
  });
});

describe('headers', () => {
  const config = {
    headers: {
      'X-Foo': 'bar',
    },
  };
  verbs.forEach(verb => {
    test(`${verb} sends correct headers`, () => {
      resetMocks();
      transport.request(verb, 'https://wp.com/wp-json', {}, config);
      expect(fetch.mock.calls[0][1].headers).toEqual(new Headers(config.headers));
    });
  });
});

describe('basic auth', () => {
  const config = {
    auth: {
      username: 'foo',
      password: 'bar',
    },
  };

  const expected = new Headers({
    Authorization: 'Basic ' + base64.encode('foo:bar'),
  });

  verbs.forEach(verb => {
    test(`${verb} can use basic auth`, () => {
      resetMocks();
      transport.request(verb, 'https://wp.com/wp-json', {}, config);
      expect(fetch.mock.calls[0][1].headers).toEqual(expected);
    });
  });
});

describe('merge config', () => {
  const config = {
    foo: 'bar',
    bar: 'foo',
  };

  verbs.forEach(verb => {
    const expected = {
      ...config,
      method: verb,
      body: JSON.stringify({}),
      headers: new Headers(),
    };

    test(`${verb} passes custom config`, () => {
      resetMocks();
      if (['GET', 'DELETE'].includes(verb)) {
        expected.body = undefined;
      }
      transport.request(verb, 'https://wp.com/wp-json', {}, config);
      expect(fetch.mock.calls[0][1]).toEqual(expected);
    });
  });
});

describe('with data', () => {
  const data = { foo: 'bar' };

  verbs.forEach(verb => {
    test(`${verb} sends data`, () => {
      resetMocks();
      transport.request(verb, 'https://wp.com/wp-json', data);
      if (['GET', 'DELETE'].includes(verb)) {
        expect(fetch.mock.calls[0][0]).toBe('https://wp.com/wp-json?foo=bar');
        expect(fetch.mock.calls[0][1].body).toBe(undefined);
      } else {
        expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify(data));
      }
    });
  });
});

describe('with form data', () => {
  const formData = new FormData();
  formData.append('foo', 'bar');
  verbs.forEach(verb => {
    test(`${verb} sends form data`, () => {
      resetMocks();
      if (['GET', 'DELETE'].includes(verb)) {
        try {
          transport.request(verb, 'https://wp.com/wp-json', formData);
        } catch (error) {
          expect(error instanceof TypeError).toBe(true);
          expect(error.message).toBe('Unable to encode FormData for GET, DELETE requests');
        }
      } else {
        transport.request(verb, 'https://wp.com/wp-json', formData);
        expect(fetch.mock.calls[0][1].body instanceof FormData).toBe(true);
      }
    });
  });
});

describe('without data', () => {
  verbs.forEach(verb => {
    test(`${verb} sends data`, () => {
      resetMocks();
      transport.request(verb, 'https://wp.com/wp-json');
      if (['GET', 'DELETE'].includes(verb)) {
        expect(fetch.mock.calls[0][0]).toBe('https://wp.com/wp-json');
        expect(fetch.mock.calls[0][1].body).toBe(undefined);
      } else {
        expect(fetch.mock.calls[0][1].body).toBe(undefined);
      }
    });
  });
});

describe('returns json', () => {
  verbs.forEach(verb => {
    test(`${verb} returns data`, () => {
      resetMocks();
      transport.request(verb, 'https://wp.com/wp-json').then(response => {
        expect(response.data).toEqual({ mock: 'response' });
      });
    });
  });
});

describe('http exceptions', () => {
  verbs.forEach(verb => {
    test(`${verb} throws http exceptions`, () => {
      resetMocks();
      fetch.resetMocks();
      const response = new Response(null, {
        status: 422,
        statusText: 'Invalid input data',
      });
      fetch.mockReject(new HTTPError(response));
      transport.request(verb, 'https://wp.com/wp-json').catch(error => {
        expect(error instanceof HTTPError).toBe(true);
        expect(error.response).toEqual(response);
      });
    });
  });
});
