const { getToken } = require("../auth/auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let client;
let token;


function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(max = 100) {
  return Math.floor(Math.random() * (max + 1));
}

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


describe("📊 Analytics API E2E", () => {
  test("GET count", async () => {
    try {
      const res = await client.get("/analytics/account/count");
      expect([200, 201]).toContain(res.status);
   
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
   
    } catch (err) {
      logError("/analytics/account/retention-rate", err);
    }
  });

  test("GET average revenue", async () => {
    try {
      const res = await client.get("/analytics/account/average-revenue");
      expect([200, 201]).toContain(res.status);
    
    } catch (err) {
      logError("/analytics/account/average-revenue", err);
    }
  });

  test("GET top client by revenue", async () => {
    try {
      const limit = randomInt(100); 
      const res = await client.get("/analytics/account/top-client-by-revenue", {
        params: { limit },
      });
      expect([200, 201]).toContain(res.status);
    } catch (err) {
      logError("/analytics/account/top-client-by-revenue", err);
    }
  });
  

  test("GET total transactions", async () => {
    try {
      const res = await client.get("/analytics/account/total-transactions");
      expect([200, 201]).toContain(res.status);
    
    } catch (err) {
      logError("/analytics/account/total-transactions", err);
    }
  });

  test("GET counts per account", async () => {
    try {
      const res = await client.get("/analytics/account/counts-per-account");
      expect([200, 201]).toContain(res.status);
   
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
     
    } catch (err) {
      logError("/analytics/product/top-selling", err);
    }
  });
  

  test("GET profitability", async () => {
    try {
      const res = await client.get("/analytics/product/profitability");
      expect([200, 201]).toContain(res.status);
   
    } catch (err) {
      logError("/analytics/product/profitability", err);
    }
  });

  test("GET inventory turnover", async () => {
    try {
      const res = await client.get("/analytics/product/inventory-turnover");
      expect([200, 201]).toContain(res.status);
   
    } catch (err) {
      logError("/analytics/product/inventory-turnover", err);
    }
  });

  test("GET stock", async () => {
    try {
      const res = await client.get("/analytics/product/stock");
      expect([200, 201]).toContain(res.status);
    
    } catch (err) {
      logError("/analytics/product/stock", err);
    }
  });

  test("GET return rate", async () => {
    try {
      const res = await client.get("/analytics/product/return-rate");
      expect([200, 201]).toContain(res.status);
   
    } catch (err) {
      logError("/analytics/product/return-rate", err);
    }
  });

  test("GET sales", async () => {
    try {
      const limit = randomInt(100);
      const res = await client.get("/analytics/product/sales");
      expect([200, 201]).toContain(res.status);
   
    } catch (err) {
      logError("/analytics/product/sales", err);
    }
  });
});
