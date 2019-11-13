import Client from "../src";

describe("Client.config", () => {
  test("it extends default config", () => {
    const client = new Client({
      endpoint: "https://wp.test/wp-json/"
    });
    client._config = { nested: { a: "1" }, foo: "bar", bam: "wham" };
    client.config({ nested: { a: "1.1", b: "2.2" }, foo: "bar" });
    expect(client._config).toEqual({
      nested: { a: "1.1", b: "2.2" },
      foo: "bar",
      bam: "wham"
    });
  });
});
