import axios from 'axios';
import defaultOptions from './options';
import qs from 'qs';
import urljoin from 'url-join';
import { isObject, objectKeysToSnakeCase } from './util';

// Predefined resources.
const RESOURCES = [
  'categories',
  'comments',
  'media',
  'statuses',
  'pages',
  'posts',
  'settings',
  'tags',
  'taxonomies',
  'types',
  'users',
];

export default class Client {
  /**
   * Axios client.
   *
   * @var {Axios}
   */
  axios = null;

  /**
   * Current options.
   *
   * @var {object}
   */
  options = {};

  /**
   * Request path.
   *
   * @var {string}
   */
  path = '';

  /**
   * Request params.
   *
   * @var {object}
   */
  params = {};

  /**
   * Client constructor.
   *
   * @param {object} opts
   */
  constructor(opts = {}) {
    this.options = Object.assign({}, defaultOptions, this.options, opts);
    this.axios = this._createAxiosClient();

    // Set up predefined resources methods.
    RESOURCES.forEach(method => {
      this[method] = () => {
        return this.resource(method);
      };
    });
  }

  /**
   * Create axios client.
   *
   * @return {Axios}
   */
  _createAxiosClient() {
    const auth = Object.assign({}, defaultOptions.auth, this.options.auth);
    const options = Object.assign({}, this.options.axios, {
      auth: auth.username.length || auth.password.length ? auth : null,
      baseURL: this._createBaseUrl(),
      headers: this.options.headers,
    });

    return axios.create(options);
  }

  /**
   * Create base url.
   *
   * @param  {object} params
   *
   * @return {string}
   */
  _createBaseUrl(params = {}) {
    const namespace = this.options.namespace;
    const endpoint = this.options.endpoint.replace(namespace, '');
    return endpoint;
  }

  /**
   * Create path.
   *
   * @param  {object} params
   *
   * @return {string}
   */
  _createPath(path, params = {}) {
    path = path ? path : '';
    path = typeof path === 'string' ? path : path.toString();
    params = Object.assign({}, this.params, params);
    params = objectKeysToSnakeCase(params);

    let querys = qs.stringify(params);
    querys = querys.length ? '?' + querys : '';

    return urljoin(this.options.namespace, this.path, path, querys);
  }

  /**
   * Create request.
   *
   * @param  {string} path
   * @param  {object} data
   * @param  {object} params
   *
   * @return {Promise}
   */
  create(path, data, params = {}) {
    return this.axios.post(this._createPath(path, params), data);
  }

  /**
   * Enable embed mode.
   *
   * @return {Client}
   */
  embed() {
    return this.param('_embed', true);
  }

  /**
   * Delete request.
   *
   * @param  {string} path
   * @param  {object} params
   *
   * @return {Promise}
   */
  delete(path, params = {}) {
    if (isObject(path)) {
      params = path;
      path = '';
    }

    return this.axios.delete(this._createPath(path, params));
  }

  /**
   * Get request.
   *
   * @param  {string} path
   * @param  {object} params
   *
   * @return {Promise}
   */
  get(path, params = {}) {
    if (isObject(path)) {
      params = path;
      path = '';
    }

    return this.axios.get(this._createPath(path, params));
  }

  /**
   * Set a single header or headers object.
   *
   * @param  {object|string} headers
   *
   * @return {Client}
   */
  headers(headers, value = '') {
    if (typeof headers === 'string') {
      this.options[headers] = value;
    } else {
      this.options.headers = Object.assign({}, this.options.headers, headers);
    }

    return this;
  }

  /**
   * Modify namespace that is used.
   *
   * @param  {string}  namespace
   *
   * @return {Client}
   */
  namespace(namespace) {
    this.options.namespace = namespace;
    return this;
  }

  /**
   * Sets the resource request path.
   *
   * @param  {string} path
   *
   * @return {Client}
   */
  resource(path) {
    this.path = path;
    return this;
  }

  /**
   * Get or set global params.
   *
   * @param  {string|object} key
   * @param  {object} value
   *
   * @return {Client|object}
   */
  param(key, value = null) {
    if (typeof key === 'string' && !value) {
      return this.params[key];
    }

    if (typeof key === 'string') {
      this.params[key] = value;
    } else {
      this.params = Object.assign({}, this.params, key);
    }

    return this;
  }

  /**
   * Update request.
   *
   * @param  {string} path
   * @param  {object} data
   * @param  {object} params
   *
   * @return {Promise}
   */
  update(path, data, params = {}) {
    return this.axios.post(this._createPath(path, params), data);
  }
};
