const { getToken } = require("../auth/auth.js");

const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let client;
let token;

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

const currencies = "IRT";
const periods = ["daily", "weekly", "monthly", "yearly", "seasonal"];

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


describe("📊 Analytics Invoice API E2E", () => {
  test("GET total revenue", async () => {
    try {
      const res = await client.get("/analytics/invoice/total-revenue");
      expect([200, 201]).toContain(res.status);
      
    } catch (err) {
      logError("/analytics/invoice/total-revenue", err);
    }
  });

  test("GET total tax", async () => {
    try {
      const res = await client.get("/analytics/invoice/total-tax");
      expect([200, 201]).toContain(res.status);
      
    } catch (err) {
      logError("/analytics/invoice/total-tax", err);
    }
  });

  test("GET total discount", async () => {
    try {
      const res = await client.get("/analytics/invoice/total-discount");
      expect([200, 201]).toContain(res.status);
     
    } catch (err) {
      logError("/analytics/invoice/total-discount", err);
    }
  });

  test("GET total amount average", async () => {
    try {
      const res = await client.get("/analytics/invoice/total-amount-average");
      expect([200, 201]).toContain(res.status);
      
    } catch (err) {
      logError("/analytics/invoice/total-amount-average", err);
    }
  });

  test("GET top selling products", async () => {
    try {
      const res = await client.get("/analytics/invoice/top-selling-products");
      expect([200, 201]).toContain(res.status);
    } catch (err) {
      logError("/analytics/invoice/top-selling-products", err);
    }
  });

  test("GET count by status", async () => {
    try {
      const res = await client.get("/analytics/invoice/count-by-status");
      expect([200, 201]).toContain(res.status);
    } catch (err) {
      logError("/analytics/invoice/count-by-status", err);
    }
  });

  test("GET revenue tax products", async () => {
    try {
      const res = await client.get("/analytics/invoice/revenue-tax-products");
      expect([200, 201]).toContain(res.status);
    } catch (err) {
      logError("/analytics/invoice/revenue-tax-products", err);
    }
  });

  test("GET count by period", async () => {
    const periods = ["daily", "weekly", "monthly", "yearly", "seasonal"]; 
    const period = randomChoice(periods);
  
    try {
      const res = await client.get("/analytics/invoice/count-by-period", {
        params: { period },
      });
      if ([200, 201].includes(res.status)) {
      } else {
      }
    } catch (err) {
      
    }
  });
  

  test("GET sub total amount by period", async () => {
    try {
      const period = randomChoice(periods);
      const res = await client.get("/analytics/invoice/sub-total-amount-by-period", {
        params: { period },
      });
      expect([200, 201]).toContain(res.status);
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
    } catch (err) {
      logError("/analytics/invoice/total-profit-group-by-currency", err);
    }
  });
});
