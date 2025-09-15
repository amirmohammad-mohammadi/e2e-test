// analytics-account.test.js
const { getToken } = require("./auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let client;
let token;

// ----------------------------
// توابع کمکی
// ----------------------------
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(max = 100) {
  return Math.floor(Math.random() * (max + 1));
}
function getDates() {
  const now = new Date();
  const startDate = now.toISOString().split("T")[0]; // امروز
  const past = new Date();
  past.setFullYear(past.getFullYear() - 1); // یک سال قبل
  const endDate = past.toISOString().split("T")[0];
  return { startDate, endDate };
}

const periods = ["daily", "weekly", "monthly", "yearly", "seasonal"];
const currencies = ["USD", "IRT", "IRR", "AED", "EUR", "ALL"];
const transactionTypes = ["sell", "receive", "payment"];

// ----------------------------
// آماده‌سازی
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
// تست‌ها
// ----------------------------
describe("📊 Analytics transactions API E2E", () => {
  test("total amount", async () => {
    try {
      const res = await client.get("/analytics/transaction/total-amount");
      expect([200, 201]).toContain(res.status);
      console.log("✅ total amount:", res.data);
    } catch (err) {
      logError("/analytics/transaction/total-amount", err);
    }
  });

  test("GET count by payment method", async () => {
    try {
      const res = await client.get("/analytics/transaction/count-by-payment-method");
      expect([200, 201]).toContain(res.status);
      console.log("✅ count by payment method:", res.data);
    } catch (err) {
      logError("/analytics/transaction/count-by-payment-method", err);
    }
  });

  test("GET count by type", async () => {
    try {
      const res = await client.get("/analytics/transaction/count-by-type");
      expect([200, 201]).toContain(res.status);
      console.log("✅ count by type:", res.data);
    } catch (err) {
      logError("/analytics/transaction/count-by-type", err);
    }
  });

  test("GET count by status", async () => {
    try {
      const res = await client.get("/analytics/transaction/count-by-status");
      expect([200, 201]).toContain(res.status);
      console.log("✅ count by status:", res.data);
    } catch (err) {
      logError("/analytics/transaction/count-by-status", err);
    }
  });

  test("GET total tax", async () => {
    try {
      const res = await client.get("/analytics/transaction/total-tax");
      expect([200, 201]).toContain(res.status);
      console.log("✅ total tax:", res.data);
    } catch (err) {
      logError("/analytics/transaction/total-tax", err);
    }
  });

  test("GET total amount by type", async () => {
    try {
      const res = await client.get("/analytics/transaction/total-amount-by-type");
      expect([200, 201]).toContain(res.status);
      console.log("✅ total amount by type:", res.data);
    } catch (err) {
      logError("/analytics/transaction/total-amount-by-type", err);
    }
  });

  test("GET count by period", async () => {
    try {
      const res = await client.get("/analytics/transaction/count-by-period", {
        params: { period: randomChoice(periods) },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ count by period:", res.data);
    } catch (err) {
      logError("/analytics/transaction/count-by-period", err);
    }
  });

//   test("GET total amount period", async () => {
//     try {
//       const { startDate, endDate } = getDates();
//       const res = await client.get("/analytics/transaction/total-amount-period", {
//         params: {
//           period: randomChoice(periods),
//           currency: randomChoice(currencies),
//           startDate,
//           endDate,
//           transactionType: randomChoice(transactionTypes),
//         },
//       });
//       expect([200, 201]).toContain(res.status);
//       console.log("✅ total amount period:", res.data);
//     } catch (err) {
//       logError("/analytics/transaction/total-amount-period", err);
//     }
//   });
test("GET total amount period", async () => {
    try {
      const transactionType = randomChoice(["sell", "receive", "payment"]);
      const period = randomChoice(["daily", "weekly", "monthly", "yearly", "seasonal"]);
      const currency = randomChoice(["USD", "IRT", "IRR", "AED", "EUR", "ALL"]);
      const endDate = new Date(); // now
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1); // 1 year ago
  
      const res = await client.get(`/analytics/transaction/total-amount-period/${transactionType}`, {
        params: {
          period,
          currency,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
  
      expect([200, 201]).toContain(res.status);
      console.log("✅ total amount period:", res.data);
    } catch (err) {
      logError("/analytics/transaction/total-amount-period", err);
    }
  });
  

  test("GET total amount current date", async () => {
    try {
      const { startDate, endDate } = getDates();
      const res = await client.get("/analytics/transaction/total-amount-current-date", {
        params: {
          startDate,
          endDate,
          currency: randomChoice(currencies),
          period: randomChoice(periods),
        },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ total amount current date:", res.data);
    } catch (err) {
      logError("/analytics/transaction/total-amount-current-date", err);
    }
  });

  test("GET total amount by jalali date", async () => {
    try {
      const { startDate, endDate } = getDates();
      const res = await client.get("/analytics/transaction/total-amount-by-jalali-date", {
        params: {
          startDate,
          endDate,
          currency: randomChoice(currencies),
          period: randomChoice(periods),
        },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ total amount by jalali date:", res.data);
    } catch (err) {
      logError("/analytics/transaction/total-amount-by-jalali-date", err);
    }
  });

  test("GET total amount", async () => {
    try {
      const { startDate, endDate } = getDates();
      const res = await client.get("/analytics/transaction/total-amount", {
        params: {
          transactionType: randomChoice(transactionTypes),
          startDate,
          endDate,
          currency: randomChoice(currencies),
        },
      });
      expect([200, 201]).toContain(res.status);
      console.log("✅ total amount:", res.data);
    } catch (err) {
      logError("/analytics/transaction/total-amount", err);
    }
  });

  test("GET total amount group by date", async () => {
    try {
      const { startDate, endDate } = getDates();
      const transactionType = randomChoice(transactionTypes);
      const currency = randomChoice(currencies);
      const period = randomChoice(periods);
  
      const res = await client.get(`/analytics/transaction/total-amount-group-by-date/${transactionType}`, {
        params: {
          startDate,
          endDate,
          currency,
          period,
        },
      });
  
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total amount group by date:", res.data);
    } catch (err) {
      logError("/analytics/transaction/total-amount-group-by-date", err);
    }
  });
  

  test("GET total amount group by currency", async () => {
    try {
      const { startDate, endDate } = getDates();
      const transactionType = randomChoice(transactionTypes);
  
      const res = await client.get(`/analytics/transaction/total-amount-group-by-currency/${transactionType}`, {
        params: {
          startDate,
          endDate,
        },
      });
  
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total amount group by currency:", res.data);
    } catch (err) {
      logError("/analytics/transaction/total-amount-group-by-currency", err);
    }
  });
  

  test("GET total amount group by jalali date", async () => {
    try {
      const { startDate, endDate } = getDates();
      const transactionType = randomChoice(transactionTypes); // sell / purchase / receive / payment
      const currency = randomChoice(currencies);
      const period = randomChoice(periods);
  
      const res = await client.get(`/analytics/transaction/total-amount-group-by-jalali-date/${transactionType}`, {
        params: {
          startDate,
          endDate,
          currency,
          period,
        },
      });
  
      expect([200, 201]).toContain(res.status);
      console.log("✅ Total amount group by jalali date:", res.data);
    } catch (err) {
      logError("/analytics/transaction/total-amount-group-by-jalali-date", err);
    }
  });
  
});
