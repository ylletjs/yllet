export default class HTTPError extends Error {
    /**
     * HTTPError constructor.
     *
     * @param {object} response
     */
    constructor(response: any);
    response: any;
}
