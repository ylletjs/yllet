import SuperagentClient from 'superagent';

class SuperagentTransport {
  constructor(superagent) {
    this.superagent =
      typeof superagent === 'undefined' ? SuperagentClient : superagent;

    ['post', 'get', 'put', 'patch', 'delete'].forEach(verb => {
      this[verb] = (url, data, config) => this.request(verb, url, data, config);
    });
  }

  async request(verb, url, data, config = {}) {
    let request = this.superagent[verb](url);

    if (data) {
      if ('PUT PATCH POST'.indexOf(verb.toUpperCase()) > -1) {
        request = request.send(
          data instanceof FormData ? data : JSON.stringify(data)
        );
      } else {
        if (data instanceof FormData) {
          throw new TypeError(
            'Unable to encode FormData for GET, DELETE requests'
          );
        }

        request = request.query(data);
      }
    }

    Object.keys(config.headers).forEach(key => {
      request = request.set(key, config.headers[key]);
    });

    return request.then(res => {
      return JSON.parse(res.text);
    });
  }
}
