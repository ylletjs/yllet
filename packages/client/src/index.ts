import FormData from 'isomorphic-form-data';
// @ts-ignore
import { mergeObjects, isObject, objectKeysToSnakeCase } from '@yllet/support';
import Transport from './Transport';
import { OptionsType, MiddlewareType, ParamsType } from './index.types';

const defaultRequestConfig = {
  headers: {}
};

class Client {
  /**
   * Request config.
   *
   * @var {object}
   */
  config: Record<string, any> = {};

  /**
   * File attachment.
   *
   * @var {FormData}
   */
  formData: any = undefined;

  /**
   * Request middlewares.
   *
   * @var {array}
   */
  middlewares: MiddlewareType[] = [];

  /**
   * Client options.
   *
   * @var {object}
   */
  options: OptionsType = {
    config: {},
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
  transport = new Transport();

  /**
   * Client constructor.
   *
   * @param {string|object} options
   */
  constructor(options: string|OptionsType = {}) {
    if (typeof options === 'string') {
      options = {
        endpoint: options
      };
    }

    this._setupOptions(options);
  }

  /**
   * Returns real options object.
   *
   * @param {object} options
   *
   * @return {object}
   */
  _setupOptions(options: OptionsType = {}) {
    if (!isObject(options)) {
      options = this.options;
    }

    if (!isObject(options.config)) {
      options.config = defaultRequestConfig;
    }

    // Set middlewares.
    this.middlewares = Array.isArray(options.middlewares)
      ? options.middlewares
      : [];
    delete options.middlewares;

    // Set transport.
    this.transport = options.transport ? options.transport : this.transport;
    delete options.transport;

    // Merge headers and create config object.
    const headers = mergeObjects(
      options.config.headers,
      mergeObjects(this.options.headers, options.headers || {})
    );
    options.config = { ...options.config, headers: { ...headers } };

    // Add nonce if any.
    if (options.nonce) {
      options.config.headers['X-WP-Nonce'] = options.nonce;
    }

    // Merge options.
    options = mergeObjects(this.options, options);

    // Delete headers since it's in the config object.
    delete options.headers;

    this.options = options;
  }

  /**
   * Returns full request url.
   *
   * @param  {string} path
   *
   * @return {string}
   */
  _getUrl(path:string): string {
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
  _getParams(params: ParamsType): ParamsType {
    let merged: ParamsType;
    params = isObject(params) ? objectKeysToSnakeCase(params) : {};
    merged = { ...this.params, ...params };

    if (this.formData instanceof FormData) {
      Object.keys(merged).forEach((key) => {
        this.formData.append(key, merged[key]);
      });
      merged = this.formData;
    }

    return merged;
  }

  /**
   * Run middlewares.
   *
   * @param {function} last
   *
   * @return {function}
   */
  async _runMiddlewares(last: MiddlewareType) {
    const self = this;
    const { endpoint, namespace, resource } = this.options;
    const next = async () => {
      const middleware = self.middlewares.shift();

      self.options = {
        ...self.options,
        namespace,
        resource,
        endpoint
      };

      if (!middleware) {
        return await last.call(this, self, next);
      }

      if (typeof middleware === 'function') {
        await middleware.call(this, self, next);
      }

      return self;
    };

    return await next();
  }

  /**
   * Discover the REST API from a URL.
   *
   * @param  {string} url
   *
   * @return {Promise}
   */
  discover(url:string): Promise<string> {
    return this.transport
      .get(url, {
        rest_route: '/'
      })
      .then((response) => {
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
  endpoint(endpoint:string) {
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
  file(file: string, name:string = '') {
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
  header(key: string|ParamsType, value:any = null) {
    let { headers = {} } = this.options.config;

    if (typeof key === 'string' && !value) {
      return headers[key];
    }

    if (typeof key === 'string') {
      headers[key] = value;
    } else {
      headers = { ...headers, ...key };
    }

    this.options.config = { ...this.options.config, headers: { ...headers } };

    return this;
  }

  /**
   * Modify namespace that is used.
   *
   * @param  {string}  namespace
   *
   * @return {Client}
   */
  namespace(namespace:string) {
    this.options.namespace = namespace;
    return this;
  }

  /**
   * Get the categories resource.
   *
   * @return {Client}
   */
  categories () {
    return this.resource('categories');
  }

  /**
   * Get the comments resource.
   *
   * @return {Client}
   */
  comments () {
    return this.resource('comments');
  }

  /**
   * Get the media resource.
   *
   * @return {Client}
   */
  media () {
    return this.resource('media');
  }

  /**
   * Get the statuses resource.
   *
   * @return {Client}
   */
  statuses () {
    return this.resource('statuses');
  }

  /**
   * Get the pages resource.
   *
   * @return {Client}
   */
  pages () {
    return this.resource('pages');
  }

  /**
   * Get the posts resource.
   *
   * @return {Client}
   */
  posts () {
    return this.resource('posts');
  }

  /**
   * Get the settings resource.
   *
   * @return {Client}
   */
  settings () {
    return this.resource('settings');
  }

  /**
   * Get the tags resource.
   *
   * @return {Client}
   */
  tags () {
    return this.resource('tags');
  }

  /**
   * Get the taxonomies resource.
   *
   * @return {Client}
   */
  taxonomies () {
    return this.resource('taxonomies');
  }

  /**
   * Get the types resource.
   *
   * @return {Client}
   */
  types () {
    return this.resource('types');
  }

  /**
   * Get the users resource.
   *
   * @return {Client}
   */
  users () {
    return this.resource('users');
  }

  /**
   * Get the search resource.
   *
   * @return {Client}
   */
  search () {
    return this.resource('search');
  }

  /**
   * Sets the resource path.
   *
   * @param  {string} resource
   *
   * @return {Client}
   */
  resource(resource:string) {
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
  param(key: string|ParamsType, value:any = null) {
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
   * Fetch content by slug.
   *
   * @param {string} slug
   * @param {object} params
   *
   * @return {object}
   */
  slug(slug: string, params: ParamsType) {
    return this.request('get', {
      ...params,
      per_page: 1,
      slug
    }).then((res) => res[0]);
  }

  /**
   * Send GET request.
   *
   * @param  {string} path
   * @param  {object} params
   *
   * @return {Promise}
   */
  get(path: string, params: ParamsType): Promise<any> {
    return this.request('get', path, params);
  }

  /**
   * Send Create/POST request.
   *
   * @param  {string} path
   * @param  {object} params
   *
   * @return {Promise}
   */
  create(path: string, params: ParamsType): Promise<any> {
    return this.request('post', path, params);
  }

  /**
   * Send Update/PUT request.
   *
   * @param  {string} path
   * @param  {object} params
   *
   * @return {Promise}
   */
  update(path: string, params: ParamsType): Promise<any> {
    return this.request('put', path, params);
  }

  /**
   * Send Delete request.
   *
   * @param  {string} path
   * @param  {object} params
   *
   * @return {Promise}
   */
  delete(path: string, params: ParamsType): Promise<any> {
    return this.request('delete', path, params);
  }

  /**
   * Send API request
   *
   * @param  {string} verb
   * @param  {string} path
   * @param  {object} params
   *
   * @return {Promise}
   */
  request(verb: string, path: string|ParamsType, params: ParamsType = {}): Promise<any> {
    if (isObject(path)) {
      params = path as any;
      path = '';
    }

    return new Promise((resolve, reject) => {
      this._runMiddlewares((self) => {
        const response = this.transport[verb.toLowerCase()](
          this._getUrl(path as string),
          this._getParams(params),
          this.options.config
        );

        resolve(response);
      });
    });
  }

  /**
   * Add middlewares that should be runned before request.
   *
   * @param {array|function} fn
   */
  use(fn: MiddlewareType[]|MiddlewareType) {
    if (!Array.isArray(fn)) {
      fn = [fn];
    }

    this.middlewares = this.middlewares.concat(fn);

    return this;
  }
}

export default Client;
