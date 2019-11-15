import fs from "fs";
import Client from "../src";
import FormData from "form-data";
import MockTransport from "../__mocks__/MockTransport"

// setup

const transport = new MockTransport();
const endpoint = "http://wordpress.test/wp-json";
const client = new Client({ transport, endpoint });

const params = {
  title: "Hello World",
  content: "Welcome to the Wordpress API"
};

// describe

describe("Client.file", () => {
  beforeEach(() => {
    transport.resetMocks();
  });

  // test("it can attach file from argument", () => {
  //   const file = fs.createReadStream(`${__dirname}/mocks/foo.txt`);
  //   client.file(file, "foo.txt");
  //   expect(client.formData instanceof FormData).toBe(true);
  // });

  test("it adds correct headers to request", () => {
    const file = fs.createReadStream(`${__dirname}/mocks/foo.txt`);
    client.file(file, "foo.txt");
    expect(
      client.config.headers["content-type"].includes(
        "multipart/form-data; boundary="
      )
    ).toBe(true);
    expect(
      client.config.headers["Content-Disposition"].includes(
        "attachment; filename=foo.txt"
      )
    ).toBe(true);
  });

  // test("it has fluent interface", () => {
  //   const file = fs.createReadStream(`${__dirname}/mocks/foo.txt`);
  //   const returnValue = client.file(file, "foo.txt");
  //   expect(returnValue).toBe(client);      
  // });
});
