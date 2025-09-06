// transactions.test.js
const axios = require("axios");
const fs = require("fs");
const TOKEN_FILE = "token.json";

function loadToken() {
  if (fs.existsSync(TOKEN_FILE)) {
    const data = fs.readFileSync(TOKEN_FILE);
    return JSON.parse(data).token;
  }
  throw new Error("❌ No token found! Run auth.test.js first to generate token.");
}

const AUTH_TOKEN = `Bearer ${loadToken()}`;
const API_BASE = "https://cnt.liara.run";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    Authorization: AUTH_TOKEN,
    "Content-Type": "application/json",
  },
});

function logError(err) {
  if (err.response) {
    console.error("STATUS:", err.response.status);
    console.error("BODY:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error("ERROR:", err.message);
  }
  throw err;
}

describe("Transactions API E2E", () => {
  let accountId, bankAccountId;

  beforeAll(async () => {
    try {
      const accountRes = await client.get("/accounts");
      accountId = accountRes.data.data[0]._id;

      const bankAccountRes = await client.get("/bank-accounts");
      bankAccountId = bankAccountRes.data.data[0]._id;
    } catch (err) {
      logError(err);
    }
  }, 20000);

  async function createTransaction(options) {
    const payload = {
      amount: options.amount || "100000",
      paymentMethod: options.paymentMethod || "cash",
      transactionType: options.transactionType || "sell",
      status: options.status || "paid", // only: unpaid, paid, cancelled
      description: options.description || "Test transaction",
      account: options.account || accountId,
      bankAccount: options.bankAccount || bankAccountId,
      currency: options.currency || "IRT",
    };

    const res = await client.post("/transactions", payload);
    console.log("💰 Transaction created:", JSON.stringify(res.data.data, null, 2));
    return res;
  }

  test(
    "✅ should create transaction with status paid",
    async () => {
      try {
        const res = await createTransaction({ status: "paid" });
        expect([200, 201]).toContain(res.status);
        expect(res.data.data.status).toBe("paid");
      } catch (err) {
        logError(err);
      }
    },
    20000
  );

  test(
    "✅ should create transaction with status unpaid",
    async () => {
      try {
        const res = await createTransaction({ status: "unpaid" });
        expect([200, 201]).toContain(res.status);
        expect(res.data.data.status).toBe("unpaid");
      } catch (err) {
        logError(err);
      }
    },
    20000
  );

  test(
    "✅ should create transaction with status cancelled",
    async () => {
      try {
        const res = await createTransaction({ status: "cancelled" });
        expect([200, 201]).toContain(res.status);
        expect(res.data.data.status).toBe("cancelled");
      } catch (err) {
        logError(err);
      }
    },
    20000
  );

  test(
    "❌ should fail with invalid status",
    async () => {
      try {
        await createTransaction({ status: "xxx" }); // invalid
      } catch (err) {
        console.log("🚨 Expected failure:", err.response?.data || err.message);
        expect(err.response.status).toBe(400);
      }
    },
    20000
  );

  test(
    "✅ should create large amount transaction",
    async () => {
      try {
        const res = await createTransaction({
          amount: "9999999999",
          description: "Stress test transaction",
        });
        expect([200, 201]).toContain(res.status);
        expect(res.data.data.amount).toBe("9999999999");
      } catch (err) {
        logError(err);
      }
    },
    20000
  );
});
