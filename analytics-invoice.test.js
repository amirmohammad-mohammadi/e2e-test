// analytics-invoice.test.js
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

function getDateRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

const currencies = ["USD", "IRT", "IRR", "AED", "EUR", "ALL"];
const periods = ["daily", "weekly", "monthly", "yearly", "seasonal"];

// ----------------------------
// beforeAll: آماده‌سازی
// ----------------------------
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
describe("📊 Analytics Invoice API E2E", () => {
  test("GET total revenue", async () => {
    try {
      const res = await client.get("/analytics/invoice/total-revenue");
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total Revenue:", res.data);
    } catch (err) {
      logError("/analytics/invoice/total-revenue", err);
    }
  });

  test("GET total tax", async () => {
    try {
      const res = await client.get("/analytics/invoice/total-tax");
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total Tax:", res.data);
    } catch (err) {
      logError("/analytics/invoice/total-tax", err);
    }
  });

  test("GET total discount", async () => {
    try {
      const res = await client.get("/analytics/invoice/total-discount");
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total Discount:", res.data);
    } catch (err) {
      logError("/analytics/invoice/total-discount", err);
    }
  });

  test("GET total amount average", async () => {
    try {
      const res = await client.get("/analytics/invoice/total-amount-average");
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total Amount Average:", res.data);
    } catch (err) {
      logError("/analytics/invoice/total-amount-average", err);
    }
  });

  test("GET top selling products", async () => {
    try {
      const res = await client.get("/analytics/invoice/top-selling-products");
      expect([200, 201]).toContain(res.status);
      console.log("✅ Top Selling Products:", res.data);
    } catch (err) {
      logError("/analytics/invoice/top-selling-products", err);
    }
  });

  test("GET count by status", async () => {
    try {
      const res = await client.get("/analytics/invoice/count-by-status");
      expect([200, 201]).toContain(res.status);
      console.log("✅ Count By Status:", res.data);
    } catch (err) {
      logError("/analytics/invoice/count-by-status", err);
    }
  });

  test("GET revenue tax products", async () => {
    try {
      const res = await client.get("/analytics/invoice/revenue-tax-products");
      expect([200, 201]).toContain(res.status);
      console.log("✅ Revenue Tax Products:", res.data);
    } catch (err) {
      logError("/analytics/invoice/revenue-tax-products", err);
    }
  });

  test("GET count by period", async () => {
    const periods = ["daily", "weekly", "monthly", "yearly", "seasonal"]; // مشخص کردن period ها
    const period = randomChoice(periods);
  
    try {
      const res = await client.get("/analytics/invoice/count-by-period", {
        params: { period },
      });
      if ([200, 201].includes(res.status)) {
        console.log("✅ Count By Period:", period, res.data);
      } else {
        console.warn(`⚠ Unexpected status ${res.status} for period ${period}`);
      }
    } catch (err) {
      console.error(`❌ /analytics/invoice/count-by-period failed for period ${period}`);
      console.error(err.response?.data || err.message);
    }
  });
  

  test("GET sub total amount by period", async () => {
    try {
      const period = randomChoice(periods);
      const res = await client.get("/analytics/invoice/sub-total-amount-by-period", {
        params: { period },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ Sub Total Amount By Period:", period, res.data);
    } catch (err) {
      logError("/analytics/invoice/sub-total-amount-by-period", err);
    }
  });

  test("GET total revenue current date", async () => {
    try {
      const { startDate, endDate } = getDateRange();
      const currency = randomChoice(currencies);
      const res = await client.get("/analytics/invoice/total-revenue-current-date", {
        params: { startDate, endDate, currency },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total Revenue Current Date:", startDate, "→", endDate, currency, res.data);
    } catch (err) {
      logError("/analytics/invoice/total-revenue-current-date", err);
    }
  });

  test("GET total revenue by Jalali date", async () => {
    try {
      const res = await client.get("/analytics/invoice/total-revenue-by-jalali-date", {
        params: {
          startDate: "1402-01-01",
          endDate: "1402-12-29",
          currency: randomChoice(currencies),
        },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total Revenue By Jalali Date:", res.data);
    } catch (err) {
      logError("/analytics/invoice/total-revenue-by-jalali-date", err);
    }
  });

  test("GET total profit", async () => {
    try {
      const { startDate, endDate } = getDateRange();
      const currency = randomChoice(currencies);
      const res = await client.get("/analytics/invoice/total-profit", {
        params: { startDate, endDate, currency },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total Profit:", startDate, "→", endDate, currency, res.data);
    } catch (err) {
      logError("/analytics/invoice/total-profit", err);
    }
  });

  test("GET total profit group by date", async () => {
    try {
      const { startDate, endDate } = getDateRange();
      const currency = randomChoice(currencies);
      const period = randomChoice(periods);
      const res = await client.get("/analytics/invoice/total-profit-group-by-date", {
        params: { startDate, endDate, currency, period },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total Profit Group By Date:", startDate, "→", endDate, currency, period, res.data);
    } catch (err) {
      logError("/analytics/invoice/total-profit-group-by-date", err);
    }
  });

  test("GET total profit group by jalali date", async () => {
    try {
      const currency = randomChoice(currencies);
      const period = randomChoice(periods);
      const res = await client.get("/analytics/invoice/total-profit-group-by-jalali-date", {
        params: {
          startDate: "1402-01-01",
          endDate: "1402-12-29",
          currency,
          period,
        },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total Profit Group By Jalali Date:", currency, period, res.data);
    } catch (err) {
      logError("/analytics/invoice/total-profit-group-by-jalali-date", err);
    }
  });

  test("GET total profit group by currency", async () => {
    try {
      const { startDate, endDate } = getDateRange();
      const res = await client.get("/analytics/invoice/total-profit-group-by-currency", {
        params: { startDate, endDate },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total Profit Group By Currency:", startDate, "→", endDate, res.data);
    } catch (err) {
      logError("/analytics/invoice/total-profit-group-by-currency", err);
    }
  });
});
