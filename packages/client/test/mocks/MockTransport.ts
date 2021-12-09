import 'core-js/features/promise';
import { fn } from 'jest-mock';

export default class MockTransport {
  responses: Record<string, any> = {};

  constructor(responses = {}) {
    this.responses = responses;
    this.resetMocks();
  }

  resetMocks() {
    ['post', 'get', 'put', 'delete'].forEach((verb) => {
      this[verb] = fn((url, data, config) => this.request(verb));
    });
  }

  request(verb: string) {
    return new Promise((resolve, reject) => {
      if (this.responses[verb]) {
        resolve(this.responses[verb]);
      }
    });
  }
}
