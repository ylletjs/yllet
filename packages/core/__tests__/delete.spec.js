import Client from "../src";
import MockTransport from "./mocks/MockTransport";

// mocks

const data = {
  title: "Hello world",
  content: "Welcome to Wordpress"
};

// describe

describe("Client.delete", () => {
  test("it calls transport with correct args", () => {
    const client = new Client({
      endpoint: "http://wordpress.test/wp-json/",
      transport: new MockTransport()
    });
    client.delete("products/1");
    expect(client.transport.delete.mock.calls[0][0]).toBe(
      "http://wordpress.test/wp-json/wp/v2/products/1"
    );
    expect(client.transport.delete.mock.calls[0][1]).toEqual({});
    expect(client.transport.delete.mock.calls[0][2]).toBe(client._config);
  });
});
