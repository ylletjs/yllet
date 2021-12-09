import { qsEncode } from '@yllet/support';
import KyClient from 'ky';
import FormData from 'isomorphic-form-data';

class KyTransport {
  constructor(ky) {
    this.ky = typeof ky === 'undefined' ? KyClient : ky;
    ['post', 'get', 'put', 'delete'].forEach((verb) => {
      this[verb] = (url, data, config) => this.request(verb, url, data, config);
    });
  }

  async request(verb, url, data, config = {}) {
    const request = {
      ...config,
      method: verb.toUpperCase()
    };

    if (data) {
      if (['PUT', 'POST'].includes(verb.toUpperCase())) {
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

    return await this.ky(url, request).json();
  }
}
