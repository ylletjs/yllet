// @ts-ignore
import { HTTPError, qsEncode } from '@yllet/support';
import FormData from 'isomorphic-form-data';
import type { Transport as ITransport } from './Transport.types';
class Transport implements ITransport {
  /**
   * Send delete request.
   *
   * @param {string} url
   * @param {object} data
   * @param {object} config
   *
   * @return {object}
   */
  delete(
    url: string,
    data: Record<string, any> | undefined = undefined,
    config: Record<string, any> = {},
  ): any {
    return this.request('delete', url, data, config);
  }

  /**
   * Send get request.
   *
   * @param {string} url
   * @param {object} data
   * @param {object} config
   *
   * @return {object}
   */
  get(
    url: string,
    data: Record<string, any> | undefined = undefined,
    config: Record<string, any> = {},
  ): any {
    return this.request('get', url, data, config);
  }

  /**
   * Send post request.
   *
   * @param {string} url
   * @param {object} data
   * @param {object} config
   *
   * @return {object}
   */
  post(
    url: string,
    data: Record<string, any> | undefined = undefined,
    config: Record<string, any> = {},
  ): any {
    return this.request('post', url, data, config);
  }

  /**
   * Send put request.
   *
   * @param {string} url
   * @param {object} data
   * @param {object} config
   *
   * @return {object}
   */
  put(
    url: string,
    data: Record<string, any> | undefined = undefined,
    config: Record<string, any> = {},
  ): any {
    return this.request('put', url, data, config);
  }

  /**
   * Sned request against url with data.
   *
   * @param {string} verb
   * @param {string} url
   * @param {object} data
   * @param {object} config
   *
   * @return {object}
   */
  private request(
    verb: string,
    url: string,
    data: Record<string, any> | undefined = undefined,
    config: Record<string, any> = {},
  ): any {
    const request: RequestInit = {
      ...config,
      method: verb.toUpperCase(),
    };

    if (data) {
      if (['PUT', 'POST'].includes(verb.toUpperCase())) {
        request.body = data instanceof FormData ? (data as any) : JSON.stringify(data);
      } else {
        if (data instanceof FormData) {
          throw new TypeError('Unable to encode FormData for GET, DELETE requests');
        }

        const qs = qsEncode(data);

        if (qs.length) {
          url = `${url}?${qs}`;
        }
      }
    }

    request.headers = new Headers(config.headers);

    return fetch(url, request).then((response) => {
      return response.json().then((data) => {
        if (!response.ok) {
          throw new HTTPError(data);
        }

        return data;
      });
    });
  }
}

export default Transport;
