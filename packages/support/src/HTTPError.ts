export default class HTTPError extends Error {
  /**
   * Name of the error.
   *
   * @var {string}
   */
  name: string;

  /**
   * The response.
   *
   * @var {object}
   */
  response: Record<string, any>;

  /**
   * HTTPError constructor.
   *
   * @param {object} response
   */
  constructor(response: Record<string, any>) {
    super(response.statusText);
    this.name = 'HTTPError';
    this.response = response;
  }
}
