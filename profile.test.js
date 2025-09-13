// example.test.js
const { getToken } = require("./auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let token;
let client;

// ------------------ قبل از همه تست‌ها ------------------
beforeAll(async () => {
  token = await getToken();
  console.log("✅ Token ready:", token);

  client = axios.create({
    baseURL: API_BASE,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
});

// ------------------ Helper ------------------
function logError(endpoint, err) {
  if (err.response) {
    console.error(`❌ ${endpoint} →`, err.response.status);
    console.error("Body:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(`❌ ${endpoint} ERROR:`, err.message);
  }
  throw err;
}

// ------------------ Test Suite ------------------
describe("Example API E2E", () => {
  test("should fetch tenants (real endpoint)", async () => {
    try {
      const res = await client.get("/tenants"); // مسیر واقعی API
      expect([200, 201]).toContain(res.status);
      expect(Array.isArray(res.data.data)).toBe(true);
      console.log("✅ Response (first 3):", res.data.data.slice(0, 3));
    } catch (err) {
      logError("/tenants", err);
    }
  });

  test("should fetch tags (another example endpoint)", async () => {
    try {
      const res = await client.get("/tags");
      expect([200, 201]).toContain(res.status);
      expect(Array.isArray(res.data.data)).toBe(true);
      console.log("✅ Tags (first 3):", res.data.data.slice(0, 3));
    } catch (err) {
      logError("/tags", err);
    }
  });
});
