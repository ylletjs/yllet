import axios from 'axios';
import defaultOptions from './options';
import FormData from 'form-data';
import urljoin from 'url-join';
import { isObject, objectKeysToSnakeCase } from './util';
import deepExtend from 'deep-extend';

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
   * Axios config.
   *
   * @var {object}
   */
  _config = {};

  /**
   * Predefined data object.
   *
   * @var {null|object}
   */
  _data = null;

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
    this.options = deepExtend(defaultOptions, opts);
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
    const options = deepExtend({}, this.options.axios, {
      auth: auth.username.length || auth.password.length ? auth : null,
      baseURL: this._createBaseUrl(),
      headers: this.options.headers,
    });

    return axios.create(options);
  }

  /**
   * Create base url.
   *
   * @return {string}
   */
  _createBaseUrl() {
    const namespace = this.options.namespace;
    const endpoint = this.options.endpoint.replace(namespace, '');
    return endpoint;
  }

  /**
   * Create request data.
   *
   * @param  {object} data
   *
   * @return {object}
   */
  _createData(data) {
    if (!isObject(this._data)) {
      return data;
    }

    if (typeof this._data.append === 'function') {
      Object.keys(data).forEach(key => {
        this._data.append(key, data[key]);
      });
    }

    return this._data;
  }

  /**
   * Create path.
   *
   * @param  {string} path
   *
   * @return {string}
   */
  _createPath(path) {
    path = path ? path : '';
    path = typeof path === 'string' ? path : path.toString();

    return urljoin(this.options.namespace, this.path, path);
  }

  /**
   * Set Axios config object.
   *
   * @param  {object} config
   *
   * @return {object}
   */
  config(config) {
    this._config = deepExtend({}, this._config, config);

    if (isObject(this._config.params)) {
      this._config.params = objectKeysToSnakeCase(this._config.params);
    }

    return this;
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
    if (isObject(path)) {
      params = data;
      data = path;
      path = '';
    }

    this.config({
      params: params
    });

    return this.axios.post(this._createPath(path), this._createData(data), this._config);
  }

  /**
   * Discover the REST API from a URL.
   *
   * @param  {string} url
   *
   * @return {Promise}
   */
  static discover(url) {
    return axios.get(urljoin(url, '?rest_route=/')).then(res => {
      if (isObject(res.data) && typeof res.data.routes !== 'undefined') {
        return res.data.routes['/']._links.self;
      }

      throw new Error( 'Unable to find the REST API');
    });
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

    this.config({
      params: params
    });

    return this.axios.delete(this._createPath(path), this._config);
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
   *
   * Specify a file or a file buffer to attach to the request with a name (optional).
   *
   * @param  {string} file
   * @param  {string} name
   *
   * @return {Client}
   */
  file(file, name) {
    if ((typeof name !== 'string' || !name.length) && typeof file === 'string') {
      name = file.split('/');
      name = name[name.length - 1];
    }

    // Create form data.
    this._data = new FormData();
    this._data.append('file', file);

    // Append form data headers.
    this.header(this._data.getHeaders());

    // Create content disposition header.
    return this.header('Content-Disposition', 'attachment; filename='+name);
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

    this.config({
      params: params
    });

    return this.axios.get(this._createPath(path), this._config);
  }

  /**
   * Set a single header or headers object.
   *
   * @param  {object|string} headers
   * @param  {string} value
   *
   * @return {Client|string}
   */
  header(key, value = null) {
    this._config.headers = this._config.headers || {};

    if (typeof key === 'string' && !value) {
      return this._config.headers[key];
    }

    if (typeof key === 'string') {
      this._config.headers[key] = value;
    } else {
      this._config.headers = Object.assign({}, this._config.headers, key);
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
    if (isObject(path)) {
      params = data;
      data = path;
      path = '';
    }

    this.config({
      params: params
    });

    return this.axios.post(this._createPath(path), this._createData(data), this._config);
  }
};
