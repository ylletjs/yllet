export default class MockTransport {
  constructor(responses?: {});
  responses: {};
  resetMocks(): void;
  request(verb: any): Promise<any>;
}
