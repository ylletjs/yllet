import base64 from "base-64";
import queryString from "querystringify";
import FormData from "form-data";

export default class FetchTransport {
  constructor() {
    ["post", "get", "put", "patch", "delete"].forEach(verb => {
      this[verb] = (url, data, config) => this.fetch(verb, url, data, config);
    });
  }

  fetch(verb, url, data, config = {}) {
    const request = {
      ...config,
      method: verb.toUpperCase()
    };

    if (data instanceof FormData) {
      if (verb === "GET") {
        throw new TypeError("Unable to encode FormData for GET requests");
      } else {
        request.body = FormData;
      }
    } else if (data) {
      if (verb === "GET") {
        url = `${url}?${queryString.stringify(data)}`;
      } else {
        request.body = data instanceof FormData ? data : JSON.stringify(data);
      }      
    }

    request.headers = new Headers(config.headers);

    if (config?.auth?.username && config?.auth?.password) {
      request.headers.set(
        "Authorization",
        "Basic " +
          base64.encode(`${config.auth.username}:${config.auth.password}`)
      );
    }

    return fetch(url, request).then(this._parseResponse);
  }

  _parseResponse(response) {
    if (!response.ok) {
      throw new HTTPError(response);
    }
    return response.json();
  }
}
