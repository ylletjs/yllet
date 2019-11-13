export default class MockTransport {
  constructor(responses = {}) {
    this.responses = responses;
    ["post", "get", "put", "patch", "delete"].forEach(verb => {
      this[verb] = jest.fn((url, data, config) => this.request(verb));
    });
  }

  request(verb) {
    return new Promise((resolve, reject) => {
      if (this.responses[verb]) {
        resolve(this.responses[verb]);
      }
    });
  }
}
