import FormData from 'isomorphic-form-data';
import { mergeObjects, isObject, objectKeysToSnakeCase } from '@yllet/support';
import Transport from './Transport';

// HTTP methods map.
const METHODS = {
  get: 'get',
  create: 'post',
  update: 'patch',
  delete: 'delete'
};

// API resources.
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
  'search'
];

export default class Client {
  /**
   * Request config.
   *
   * @var {object}
   */
  config = {};

  /**
   * File attachment.
   *
   * @var {FormData}
   */
  formData = undefined;

  /**
   * Initial endpoint.
   *
   * @var {string}
   */
  initialEndpoint = '';

  /**
   * Request middlewares.
   *
   * @var {array}
   */
  middlewares = [];

  /**
   * Client options.
   *
   * @var {object}
   */
  options = {
    endpoint: '',
    headers: {
      'Content-Type': 'application/json'
    },
    namespace: 'wp/v2',
    nonce: '',
    resource: '',
    restore: true
  };

  /**
   * Request params.
   *
   * @var {object}
   */
  params = {};

  /**
   * Transport layer.
   *
   * @var {Transport}
   */
  transport = null;

  /**
   * Client constructor.
   *
   * @param {object} options
   */
  constructor(options = {}) {
    if (typeof options === 'string') {
      options = {
        endpoint: options
      };
    }

    if (!isObject(options)) {
      options = {};
    }

    this.middlewares = Array.isArray(options.middlewares)
      ? options.middlewares
      : [];
    delete options.middlewares;

    this.transport = options.transport ? options.transport : new Transport();
    delete options.transport;

    this.options = this._getOptions(options);
    this.initialEndpoint = this.options.endpoint;

    // Add nonce if any.
    if (this.options.nonce) {
      this.header('X-WP-Nonce', this.options.nonce);
    }

    // Init HTTP methods
    Object.keys(METHODS).forEach(method => {
      this[method] = (path, params) => {
        return this.request(METHODS[method], path, params);
      };
    });

    // Init predefined resources methods.
    RESOURCES.forEach(name => {
      this[name] = () => {
        return this.resource(name);
      };
    });
  }

  /**
   * Returns real options object.
   *
   * @param {object} options
   *
   * @return {object}
   */
  _getOptions(options) {
    if (!isObject(options.config)) {
      options.config = {};
    }

    if (!isObject(options.headers)) {
      options.headers = {};
    }

    // Merge headers and create config object.
    const headers = mergeObjects(this.options.headers, options.headers);
    options.config = { ...options.config, headers: { ...headers } };

    // Merge options.
    options = mergeObjects(this.options, options);

    // Delete headers since it's in the config object.
    delete options.headers;

    return options;
  }

  /**
   * Returns full request url.
   *
   * @param  {string} path
   *
   * @return {string}
   */
  _getUrl(path) {
    const { endpoint, namespace, resource } = this.options;

    const safePath = String(path || '');
    const safeEndpoint =
      endpoint.replace(namespace, '').replace(/\/$/, '') + '/';
    const safeResource = resource.replace(/^\/|\/$/g, '');
    const safeNamespace =
      namespace.replace(/^\/|\/$/g, '') + (safeResource || safePath ? '/' : '');

    return (
      safeEndpoint +
      safeNamespace +
      safeResource +
      (safeResource && safePath ? '/' : '') +
      safePath
    );
  }

  /**
   * Returns request params.
   *
   * @param  {object} params
   *
   * @return {object}
   */
  _getParams(params) {
    let merged;
    params = isObject(params) ? objectKeysToSnakeCase(params) : {};
    merged = { ...this.params, ...params };

    if (this.formData instanceof FormData) {
      Object.keys(merged).forEach(key => {
        this.formData.append(key, merged[key]);
      });
      merged = this.formData;
    }

    return merged;
  }

  /**
   * Returns request config.
   *
   * @return {object}
   */
  _getConfig() {
    return mergeObjects(this.options.config, this.config);
  }

  /**
   * Run middlewares.
   *
   * @param {function} last
   *
   * @return {function}
   */
  async _runMiddlewares(last) {
    const self = this;
    const next = async () => {
      let middleware = self.middlewares.shift();

      if (!middleware) {
        middleware = last;
      }

      if (typeof middleware === 'function') {
        await middleware.call(this, self, next);
      }

      return self;
    };

    return await next();
  }

  /**
   * Create a copy of the client without
   * restoring the configuration of endpoint,
   * namespace or resource.
   *
   * @return {Client}
   */
  copy() {
    this.options.restore = false;
    return this;
  }

  /**
   * Discover the REST API from a URL.
   *
   * @param  {string} url
   *
   * @return {Promise}
   */
  discover(url) {
    return this.transport
      .get(url, {
        rest_route: '/'
      })
      .then(response => {
        if (isObject(response.routes)) {
          return response.routes['/']._links.self;
        }

        throw new Error('Unable to find the REST API');
      });
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
   * Sets the endpoint.
   *
   * @param  {string} endpoint
   *
   * @return {Client}
   */
  endpoint(endpoint) {
    this.options.endpoint = endpoint;
    return this;
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
  file(file, name = '') {
    const formData = new FormData();
    formData.append('file', file);

    this.header('Content-Type', 'multipart/form-data');
    this.header('Content-Disposition', 'attachment; filename=' + name);

    this.formData = formData;

    return this;
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
    let { headers = {} } = this.config;

    if (typeof key === 'string' && !value) {
      return headers[key];
    }

    if (typeof key === 'string') {
      headers[key] = value;
    } else {
      headers = { ...headers, ...key };
    }

    this.config = { ...this.config, headers: { ...headers } }; // immutable

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
   * Sets the resource path.
   *
   * @param  {string} resource
   *
   * @return {Client}
   */
  resource(resource) {
    this.options.resource = resource;
    return this;
  }

  /**
   * Set/Get global param.
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
      this.params = { ...this.params, ...key };
    }

    return this;
  }

  /**
   * Send API request
   *
   * @param  {string} path
   * @param  {object} params
   *
   * @return {Promise}
   */
  request(verb, path, params) {
    if (isObject(path)) {
      params = path;
      path = '';
    }

    return this._runMiddlewares(() => {
      const response = this.transport[verb](
        this._getUrl(path),
        this._getParams(params),
        this._getConfig()
      );

      if (this.options.restore) {
        this.options = mergeObjects(this.options, {
          endpoint: this.initialEndpoint,
          namespace: 'wp/v2',
          resource: ''
        });
      }

      return response;
    });
  }

  /**
   * Add middlewares that should be runned before request.
   *
   * @param {array|function} fn
   */
  use(fn) {
    if (!Array.isArray(fn)) {
      fn = [fn];
    }

    this.middlewares = this.middlewares.concat(fn);

    return this;
  }
}
