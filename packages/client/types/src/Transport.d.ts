export default class Transport {
  /**
   * Create request against url with data and send it.
   *
   * @param {string} verb
   * @param {string} url
   * @param {object} data
   * @param {object} config
   *
   * @return {object}
   */
  request(verb: string, url: string, data: any, config?: any): any;
}
