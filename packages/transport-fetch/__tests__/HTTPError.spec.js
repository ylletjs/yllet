import HTTPError from "../src/HTTPError";

describe("HTTPError", () => {
  test("it has error message", () => {
    const response = new Response(null, {
      status: 422,
      statusText: "Invalid input data"
    });
    const error = new HTTPError(response) ;
    expect(error.message).toBe("Invalid input data");
  });

  test("it has correct name", () => {
    const response = new Response(null, {
      status: 422,
      statusText: "Invalid input data"
    });
    const error = new HTTPError(response) ;
    expect(error.name).toBe("HTTPError");
  });  

  test("it assigns response as property", () => {
    const response = new Response(null, {
      status: 422,
      statusText: "Invalid input data"
    });
    const error = new HTTPError(response) ;
    expect(error.response).toEqual(response);
    expect(error.response.status).toBe(response.status);
    expect(error.response.statusText).toBe(response.statusText);
  });    
});
