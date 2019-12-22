export default class HTTPError extends Error {
  /**
   * HTTPError constructor.
   *
   * @param {object} response
   */
  constructor(response) {
    super(response.statusText);
    this.name = 'HTTPError';
    this.response = response;
  }
}
