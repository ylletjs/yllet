import Client from "../src";
import MockTransport from "../__mocks__/MockTransport"

describe("Client", () => {
  const transport = new MockTransport();
  let client = new Client({ transport });

  test("it sets transport property", () => {
    expect(client.transport).toBe(transport);
  });

  test("it throws error when missing transport", () => {
    try {
      new Client({ transport: undefined });
    } catch (error) {
      expect(error instanceof TypeError).toBe(true);
      expect(error.message).toBe("Transport is required option, none was set.");
    }
  });

  test("it has default options", () => {
    expect(client.options).toEqual({
      auth: {
        username: "",
        password: ""
      },
      endpoint: "",
      namespace: "wp/v2",
      config: {
        referrer: "yllet",
        headers: {
          "Content-Type": "application/json"
        }
      }
    });
  });

  test("it merges options", () => {
    client = new Client({
      transport,
      endpoint: "https://wordpress.test/wp-json",
      config: {
        referrer: 'WordMess',
        foo: 'bar'
      }
    });
    expect(client.options).toEqual({
      auth: {
        username: "",
        password: ""
      },
      endpoint: "https://wordpress.test/wp-json",
      namespace: "wp/v2",
      config: {
        referrer: 'WordMess',
        foo: 'bar',
        headers: {
          "Content-Type": "application/json"
        }
      }
    });
  });

  test("it has HTTP methods", () => {
    expect(typeof client.get).toBe("function");
    expect(typeof client.create).toBe("function");
    expect(typeof client.update).toBe("function");
    expect(typeof client.delete).toBe("function");
  });

  test("it has API Resource methods", () => {
    expect(typeof client.categories).toBe("function");
    expect(typeof client.comments).toBe("function");
    expect(typeof client.media).toBe("function");
    expect(typeof client.statuses).toBe("function");
    expect(typeof client.pages).toBe("function");
    expect(typeof client.posts).toBe("function");
    expect(typeof client.settings).toBe("function");
    expect(typeof client.tags).toBe("function");
    expect(typeof client.taxonomies).toBe("function");
    expect(typeof client.types).toBe("function");
    expect(typeof client.users).toBe("function");
  });
});
