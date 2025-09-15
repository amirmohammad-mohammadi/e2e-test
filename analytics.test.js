// analytics-account.test.js
const { getToken } = require("./auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let client;
let token;

// ----------------------------
// Helpers
// ----------------------------
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(max = 100) {
  return Math.floor(Math.random() * (max + 1));
}

const periods = ["daily", "weekly", "monthly", "yearly", "seasonal"];

// ----------------------------
// beforeAll: آماده‌سازی توکن و axios instance
// ----------------------------
beforeAll(async () => {
  token = await getToken();
//   console.log("✅ Token ready:", token);

  client = axios.create({
    baseURL: API_BASE,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
});

// ----------------------------
// تابع مدیریت خطا
// ----------------------------
function logError(endpoint, err) {
  if (err.response) {
    console.error(`❌ ${endpoint} →`, err.response.status);
    console.error("BODY:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(`❌ ${endpoint} ERROR:`, err.message);
  }
  throw err;
}

// ----------------------------
// TESTS
// ----------------------------
describe("📊 Analytics API E2E", () => {
  test("GET count", async () => {
    try {
      const res = await client.get("/analytics/account/count");
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Count:", res.data);
    } catch (err) {
      logError("/analytics/account/count", err);
    }
  });

  test("GET retention rate", async () => {
    try {
      const res = await client.get("/analytics/account/retention-rate", {
        params: {
          startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
          endDate: new Date().toISOString(),
        },
      });
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Retention Rate:", res.data);
    } catch (err) {
      logError("/analytics/account/retention-rate", err);
    }
  });

  test("GET average revenue", async () => {
    try {
      const res = await client.get("/analytics/account/average-revenue");
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Average Revenue:", res.data);
    } catch (err) {
      logError("/analytics/account/average-revenue", err);
    }
  });

  test("GET top client by revenue", async () => {
    try {
      const limit = randomInt(100); // random number 0-100
      const res = await client.get("/analytics/account/top-client-by-revenue", {
        params: { limit },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ Top Client by Revenue (limit:", limit, "):", res.data);
    } catch (err) {
      logError("/analytics/account/top-client-by-revenue", err);
    }
  });
  

  test("GET total transactions", async () => {
    try {
      const res = await client.get("/analytics/account/total-transactions");
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Total Transactions:", res.data);
    } catch (err) {
      logError("/analytics/account/total-transactions", err);
    }
  });

  test("GET counts per account", async () => {
    try {
      const res = await client.get("/analytics/account/counts-per-account");
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Counts per Account:", res.data);
    } catch (err) {
      logError("/analytics/account/counts-per-account", err);
    }
  });

  test("GET creation by period", async () => {
    try {
      const period = randomChoice(periods);
      const res = await client.get("/analytics/account/creation-by-period", {
        params: { period },
      });
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Creation by Period (", period, "):", res.data);
    } catch (err) {
      logError("/analytics/account/creation-by-period", err);
    }
  });

  test("GET top selling", async () => {
    try {
      const limit = randomInt(100);
      const res = await client.get("/analytics/product/top-selling", {
        params: { limit },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ Top Selling (limit:", limit, "):", res.data);
    } catch (err) {
      logError("/analytics/product/top-selling", err);
    }
  });
  

  test("GET profitability", async () => {
    try {
      const res = await client.get("/analytics/product/profitability");
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Profitability:", res.data);
    } catch (err) {
      logError("/analytics/product/profitability", err);
    }
  });

  test("GET inventory turnover", async () => {
    try {
      const res = await client.get("/analytics/product/inventory-turnover");
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Inventory Turnover:", res.data);
    } catch (err) {
      logError("/analytics/product/inventory-turnover", err);
    }
  });

  test("GET stock", async () => {
    try {
      const res = await client.get("/analytics/product/stock");
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Stock:", res.data);
    } catch (err) {
      logError("/analytics/product/stock", err);
    }
  });

  test("GET return rate", async () => {
    try {
      const res = await client.get("/analytics/product/return-rate");
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Return Rate:", res.data);
    } catch (err) {
      logError("/analytics/product/return-rate", err);
    }
  });

  test("GET sales", async () => {
    try {
      const limit = randomInt(100);
      const res = await client.get("/analytics/product/sales");
      expect([200, 201]).toContain(res.status);
    //   console.log("✅ Sales :", res.data);
    } catch (err) {
      logError("/analytics/product/sales", err);
    }
  });
});
