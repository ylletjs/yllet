# Yllet docs v2

Yllet is a set of packages for the WordPress API for both React and non-React projects. The client is built on top of fetch, you can add your own transport by creating it.

## Installation

To install the WordPress API client:

```
npm install --save @yllet/client
```

To install the package with React bindings:

```
npm install --save @yllet/react
```

## Usage

Fetch all posts:

```js
import Client from '@yllet/client';

const client = new Client({
  endpoint: 'https://demo.wp-api.org/wp-json/'
});

client
  .posts()
  .get()
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log('Error: ' + err.message);
  });
```

## Client options

```js
{
  // Request/Transport config
  config: {
    // HTTP Headers
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // WordPress API endpoint.
  endpoint: '',

  // Default namespace.
  namespace: 'wp/v2'

  // WP Nonce, adds X-WP-Nonce header.
  nonce: ''
}
```

## Resources

Yllet client instance provides the following basic request methods:

- `client.categories()`
- `client.comments()`
- `client.media()`
- `client.statuses()`
- `client.posts()`
- `client.pages()`
- `client.settings()`
- `client.tags()`
- `client.taxonomies()`
- `client.types()`
- `client.users()`
- `client.search()`

Using any request methods sets the path so you don't have to write `client.get('posts/1')` each time instead you can just write `client.posts().get(1)`

Adding custom request methods is easy (example [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)):

```js
// Example: http://wordpress.test/wp-json/wc/v2/products
client.products = () => client.namespace('wc/v2').resource('products');
```

Then you can just call `client.products()` like you do with `client.posts()`

```js
client
  .products()
  .get()
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log('Error: ' + err.message);
  });
```

## Params

You can pass a object with the same name as as the existing params. You can write `per_page` or `perPage` when the param contains a underscore.

```js
client
  .posts()
  .get({
    slug: 'hello-world',
    perPage: 1 // or per_page
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log('Error: ' + err.message);
  });
```

You can also set global params using key/value or object:

```js
client.param('source', 'yllet');
```

All global params can be accessed with `client.params`

## Embed data

WordPress API support embedding of resources and instead of having to provide `_embed=true` as a param on every request we can simpley use `embed()` before any request method.

More about WordPress API embedding can you read [here](https://developer.wordpress.org/rest-api/using-the-rest-api/linking-and-embedding/#embedding).

```js
client
  .posts()
  .embed()
  .get({
    slug: 'hello-world'
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log('Error: ' + err.message);
  });
```

## File uploading

When Uploading a file you should use `client.file(file, [name])` to specify a file or a file buffer to attach to the request with a name (optional).

Browser example:

```js
const file = document.getElementById('my-file').files[0];

client
  .media()
  .file(file)
  .create({
    title: 'Test image'
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log('Error: ', err);
  });
```

Node example:

```js
client
  .media()
  .file(fs.createReadStream('me.jpg'))
  .create({
    title: 'Test image'
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log('Error: ', err);
  });
```

## Authentication

Yllet version 2 offers a simple cookie based auth using the WordPress nonce.

Adding a JavaScript object with `endpoint` and `nonce`

```php
wp_localize_script( 'wp-api', 'wpApiSettings', array(
    'endpoint' => esc_url_raw( rest_url() ),
    'nonce'    => wp_create_nonce( 'wp_rest' )
) );
```

With Yllet client

```js
import Client from '@yllet/client';

const client = new Client({
  endpoint: window.wpApiSettings.endpoint,
  nonce: window.wpApiSettings.nonce
});
```

## Discover the REST API from a URL

```js
import Client from '@yllet/client';

Client.discover('http://demo.wp-api.org/')
  .then(url => {
    console.log(url);
  })
  .catch(err => {
    console.log('Error: ', err);
  });
```

## React bindings

Yllets React package contains a provider component that you can use like this:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Client from '@yllet/client';
import { Provider } from '@yllet/react';

const client = new Client({
  endpoint: 'https://demo.wp-api.org/wp-json/'
});

ReactDOM.render(
  <Provider client={client}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

In your application component you can use the `withClient` component enhancer to pass along the `client` to your component.

```js
import React from 'react';
import { withClient } from '@yllet/react';

class App extends React.Component {}

export default withClient(App);
```

Then you can use `this.props.client` the same way as if it was a standalone client.

You can also use `withClientData` to pass the response data or the error from WordPress REST API.

```js
import React from 'react';
import { withClientData } from '@yllet/react';

class Post extends React.Component {}

export default withClientData((client, props) => {
  return client.posts().get(1);
})(Post);
```

Then you can use `this.props.data` or `this.props.error` and `this.props.loading`

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
