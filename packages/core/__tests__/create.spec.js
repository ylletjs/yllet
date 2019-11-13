import Client from "../src";
import MockTransport from "./mocks/MockTransport";

// mocks

const data = {
  title: "Hello world",
  content: "Welcome to Wordpress"
};

// describe

describe("Client.create", () => {
  test("it accepts path as first param", () => {
    const client = new Client({
      endpoint: "http://wordpress.test/wp-json/",
      transport: new MockTransport()
    });
    client.create("products", data);
    expect(client.transport.post.mock.calls[0][0]).toBe(
      "http://wordpress.test/wp-json/wp/v2/products"
    );
    expect(client.transport.post.mock.calls[0][1]).toEqual(data);
    expect(client.transport.post.mock.calls[0][2]).toBe(client._config);
  });

  test("it accepts data as first param", () => {
    const client = new Client({
      endpoint: "http://wordpress.test/wp-json/",
      transport: new MockTransport()
    });
    client.create(data);
    expect(client.transport.post.mock.calls[0][0]).toBe(
      "http://wordpress.test/wp-json/wp/v2"
    );
    expect(client.transport.post.mock.calls[0][1]).toEqual(data);
    expect(client.transport.post.mock.calls[0][2]).toBe(client._config);
  });
});
