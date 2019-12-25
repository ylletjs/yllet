import { HTTPError, qsEncode } from '@yllet/support';
import FormData from 'isomorphic-form-data';

export default class Transport {
  /**
   * Transport constructor.
   */
  constructor() {
    ['post', 'get', 'put', 'patch', 'delete'].forEach(verb => {
      this[verb] = (url, data, config) => this.request(verb, url, data, config);
    });
  }

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
  request(verb, url, data, config = {}) {
    const request = {
      ...config,
      method: verb.toUpperCase()
    };

    if (data) {
      if ('PUT PATCH POST'.indexOf(verb.toUpperCase()) > -1) {
        request.body = data instanceof FormData ? data : JSON.stringify(data);
      } else {
        if (data instanceof FormData) {
          throw new TypeError(
            'Unable to encode FormData for GET, DELETE requests'
          );
        }

        const qs = qsEncode(data);

        if (qs.length) {
          url = `${url}?${qs}`;
        }
      }
    }

    return fetch(url, request).then(response => {
      return response.json().then(data => {
        if (!response.ok) {
          throw new HTTPError(data);
        }

        return data;
      });
    });
  }
}
