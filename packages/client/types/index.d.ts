export default class Client {
    /**
     * Client constructor.
     *
     * @param {object} options
     */
    constructor(options?: any);
    /**
     * Request config.
     *
     * @var {object}
     */
    config: {};
    /**
     * File attachment.
     *
     * @var {FormData}
     */
    formData: any;
    /**
     * Request middlewares.
     *
     * @var {array}
     */
    middlewares: any[];
    /**
     * Client options.
     *
     * @var {object}
     */
    options: {
        endpoint: string;
        headers: {
            'Content-Type': string;
        };
        namespace: string;
        nonce: string;
        resource: string;
        restore: boolean;
    };
    /**
     * Request params.
     *
     * @var {object}
     */
    params: {};
    /**
     * Transport layer.
     *
     * @var {Transport}
     */
    transport: any;
    /**
     * Returns real options object.
     *
     * @param {object} options
     *
     * @return {object}
     */
    _setupOptions(options?: any): any;
    /**
     * Returns full request url.
     *
     * @param  {string} path
     *
     * @return {string}
     */
    _getUrl(path: string): string;
    /**
     * Returns request params.
     *
     * @param  {object} params
     *
     * @return {object}
     */
    _getParams(params: any): any;
    /**
     * Run middlewares.
     *
     * @param {function} last
     *
     * @return {function}
     */
    _runMiddlewares(last: Function): Function;
    /**
     * Discover the REST API from a URL.
     *
     * @param  {string} url
     *
     * @return {Promise}
     */
    discover(url: string): Promise<any>;
    /**
     * Enable embed mode.
     *
     * @return {Client}
     */
    embed(): Client;
    /**
     * Sets the endpoint.
     *
     * @param  {string} endpoint
     *
     * @return {Client}
     */
    endpoint(endpoint: string): Client;
    /**
     *
     * Specify a file or a file buffer to attach to the request with a name (optional).
     *
     * @param  {string} file
     * @param  {string} name
     *
     * @return {Client}
     */
    file(file: string, name?: string): Client;
    /**
     * Set a single header or headers object.
     *
     * @param  {object|string} headers
     * @param  {string} value
     *
     * @return {Client|string}
     */
    header(key: any, value?: string): string | Client;
    /**
     * Modify namespace that is used.
     *
     * @param  {string}  namespace
     *
     * @return {Client}
     */
    namespace(namespace: string): Client;
    /**
     * Sets the resource path.
     *
     * @param  {string} resource
     *
     * @return {Client}
     */
    resource(resource: string): Client;
    /**
     * Set/Get global param.
     *
     * @param  {string|object} key
     * @param  {object} value
     *
     * @return {Client|object}
     */
    param(key: any, value?: any): any;
    /**
     * Fetch content by slug.
     *
     * @param {string} slug
     * @param {object} params
     *
     * @return {object}
     */
    slug(slug: string, params: any): any;
    /**
     * Send API request
     *
     * @param  {string} path
     * @param  {object} params
     *
     * @return {Promise}
     */
    request(verb: any, path: string, params: any): Promise<any>;
    /**
     * Add middlewares that should be runned before request.
     *
     * @param {array|function} fn
     */
    use(fn: any): Client;
}
