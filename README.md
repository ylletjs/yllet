# Yllet

[![Build Status](https://travis-ci.org/frozzare/yllet.svg?branch=master)](https://travis-ci.org/frozzare/yllet)

> Work In Progress!

Yllet is a set of packages for the WordPress API for both React and non-React projects. The client is built on top of [axios](https://github.com/axios/axios).

## Installation

To install the WordPress API client:

```
npm install --save yllet
```

To install the package with React bindings:

```
npm install --save yllet-react
```

## Usage

Fetch all posts:

```js
import Client from 'yllet';

const client = new Client({
  endpoint: 'https://demo.wp-api.org/wp-json/'
});

client.posts().get().then(res => {
  console.log(res.data);
}).catch(err => {
  console.log('Error: ' + err.message);
});
```

## Client options

```js
{
  // Basic auth.
  auth: {
    username: '',
    password: ''
  },

  // Axios settings.
  axios: {},

  // HTTP headers.
  headers: {},

  // WordPress API endpoint.
  endpoint: '',

  // Default namespace.
  namespace: 'wp/v2'
}
```

If you need to pass something special to Axios you can use `axios` object. Both `auth` and `headers` will be merged to `axios` object.

You can also set headers using `client.header()` with key/value or object.

## Resources

Yllet client instance provides the following basic request methods:

* `client.categories()`
* `client.comments()`
* `client.media()`
* `client.statuses()`
* `client.posts()`
* `client.pages()`
* `client.settings()`
* `client.tags()`
* `client.taxonomies()`
* `client.types()`
* `client.users()`

Using any request methods sets the path so you don't have to write `client.get('posts/1')` each time instead you can just write `client.posts().get(1)`

Adding custom request methods is easy:

```js
// Example: http://wordpress.test/wp-json/app/v1/posts/
client.app = () => client.namespace('app/v1').resource('posts');
```

Then you can just call `client.app()` like you do with `client.posts()`:

```js
client.app().get().then(res => {
  console.log(res.data);
}).catch(err => {
  console.log('Error: ' + err.message);
});
```

## Params

You can pass a object with the same name as as the existing params. You can write `'per_page'` or `perPage` when the param contains a underscore.

```js
client.posts().get({
  slug: 'hello-world',
  perPage: 1 // or per_page
}).then(res => {
  console.log(res.data);
}).catch(err => {
  console.log('Error: ' + err.message);
});
```

You can also set global params using key/value or object:

```js
client.param('source', 'ylley');
```

All global params can be accessed with `client.params`

## Embed data.

WordPress API support embedding of resources and instead of having to provide `_embed=true` as a param on every request we can simpley use `embed()` before any request method.

More about WordPress API embedding can you read [here](https://developer.wordpress.org/rest-api/using-the-rest-api/linking-and-embedding/#embedding).

```js
client.posts().embed().get({
  slug: 'hello-world'
}).then(res => {
  console.log(res.data);
}).catch(err => {
  console.log('Error: ' + err.message);
});
```

## React bindings

Yllets React package contains a provider component that you can use like this:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Client from 'yllet';
import { Provider } from 'yllet-react';

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
import { withClient } from 'yllet-react';

class App extends React.Component {
  render() {
    return (
      <p>Hello, world</p>
    );
  }
}

export default withClient(App);
```

Then you can use `this.props.client` the same was as if it was a standalone client.

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)
