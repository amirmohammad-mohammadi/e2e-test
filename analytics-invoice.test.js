// analytics-invoice.test.js
const { getToken } = require("./auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let client;
let token;

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

// ------------------ Error logging ------------------
function logError(endpoint, err) {
  if (err.response) {
    console.error(`❌ ${endpoint} →`, err.response.status);
    console.error("BODY:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(`❌ ${endpoint} ERROR:`, err.message);
  }
  throw err;
}

// ------------------ Test Suite ------------------
describe("📊 Analytics Invoice API E2E", () => {
  test(
    "GET total revenue",
    async () => {
      try {
        const res = await client.get("/analytics/invoice/total-revenue");
        expect([200, 201]).toContain(res.status);
        console.log("✅ Total Revenue:", res.data);
      } catch (err) {
        logError("/analytics/invoice/total-revenue", err);
      }
    },
    15000
  );

  test(
    "GET total tax",
    async () => {
      try {
        const res = await client.get("/analytics/invoice/total-tax");
        expect([200, 201]).toContain(res.status);
        console.log("✅ Total Tax:", res.data);
      } catch (err) {
        logError("/analytics/invoice/total-tax", err);
      }
    },
    15000
  );
});
