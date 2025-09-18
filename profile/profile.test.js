// example.test.js
const { getToken } = require("../auth/auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let token;
let client;


beforeAll(async () => {
  token = await getToken();

  client = axios.create({
    baseURL: API_BASE,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
});

function logError(endpoint, err) {
  if (err.response) {

  } else {
  }
  throw err;
}

describe("Example API E2E", () => {
  test("should fetch tenants (real endpoint)", async () => {
    try {
      const res = await client.get("/tenants"); 
      expect([200, 201]).toContain(res.status);
      expect(Array.isArray(res.data.data)).toBe(true);
    
    } catch (err) {
      logError("/tenants", err);
    }
  });


});
