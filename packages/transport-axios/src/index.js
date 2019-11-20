import AxiosClient from 'axios';
import FormData from 'isomorphic-form-data';

export default class Transport {
  axios = undefined;

  constructor(axios) {
    this.axios = typeof axios === 'undefined' ? AxiosClient : axios;

    ['post', 'get', 'put', 'patch', 'delete'].forEach(verb => {
      this[verb] = (url, data, config) => this.fetch(verb, url, data, config);
    });
  }

  request(verb, url, data, config = {}) {
    const request = {
      ...config,
      url,
      method: verb.toUpperCase()
    };

    if (['PUT', 'PATCH', 'POST'].includes(verb.toUpperCase())) {
      request.data = data;
    } else {
      if (data instanceof FormData) {
        throw new TypeError('Unable to encode FormData for GET, DELETE requests');
      }
      request.params = data;
    }

    return this.axios(request).then(response => response.data);
  }
}
