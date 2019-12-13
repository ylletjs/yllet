# Yllet docs v1

Yllet is a set of packages for the WordPress API for both React and non-React projects. The client is built on top of fetch, you can add your own transport by creating it.

## Custom transport

To add a custom transport to the client you just pass a transport class. Yllet don't offer any other transports than fetch right now, but it's kind of easy to build one.

Examples of axios transport

```js
import Client from '@yllet/core';
import AxiosClient from 'axios';
import FormData from 'isomorphic-form-data';

class AxiosTransport {
  axios = undefined;

  constructor(axios) {
    this.axios = typeof axios === 'undefined' ? AxiosClient : axios;

    ['post', 'get', 'put', 'patch', 'delete'].forEach(verb => {
      this[verb] = (url, data, config) => this.request(verb, url, data, config);
    });
  }

  request(verb, url, data, config = {}) {
    const request = {
      ...config,
      url,
      method: verb.toUpperCase()
    };

    if ('PUT PATCH POST'.indexOf(verb.toUpperCase()) > -1) {
      request.data = data;
    } else {
      if (data instanceof FormData) {
        throw new TypeError(
          'Unable to encode FormData for GET, DELETE requests'
        );
      }
      request.params = data;
    }

    return this.axios(request).then(response => response.data);
  }
}

const client = new Client({
  endpoint: 'https://demo.wp-api.org/wp-json/',
  transport: new AxiosTransport()
});
```
