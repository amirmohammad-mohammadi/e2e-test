const { getToken } = require("../auth/auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let token;
let client;
let accountId;
let bankAccountId;


function logError(endpoint, err) {
  if (err.response) {

  } else {

  }
}

describe("Transactions API E2E", () => {
  beforeAll(async () => {
    try {
      token = await getToken();
      client = axios.create({
        baseURL: API_BASE,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const accountRes = await client.get("/accounts");
      if (!accountRes.data.data || accountRes.data.data.length === 0) {
        throw new Error("No accounts found");
      }
      accountId = accountRes.data.data[0]._id;

      const bankAccountRes = await client.get("/bank-accounts");
      if (!bankAccountRes.data.data || bankAccountRes.data.data.length === 0) {
        throw new Error("No bank accounts found");
      }
      bankAccountId = bankAccountRes.data.data[0]._id;

    } catch (err) {
      logError("Setup accounts/bankAccounts", err);
      throw err; 
    }
  }, 30000);

  async function createTransaction(options) {
    const payload = {
      amount: options.amount || "100000",
      paymentMethod: options.paymentMethod || "cash",
      transactionType: options.transactionType || "sell",
      status: options.status || "paid",
      description: options.description || "Test transaction",
      account: options.account || accountId,
      bankAccount: options.bankAccount || bankAccountId,
      currency: options.currency || "IRT",
    };

    const res = await client.post("/transactions", payload);
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
        logError("/transactions", err);
        throw err;
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
        logError("/transactions", err);
        throw err;
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
        logError("/transactions", err);
        throw err;
      }
    },
    20000
  );

  test(
    "❌ should fail with invalid status",
    async () => {
      try {
        await createTransaction({ status: "invalid" }); 
      } catch (err) {
        expect(err.response.status).toBe(400);
      }
    },
    30000
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
        logError("/transactions", err);
        throw err;
      }
    },
    30000
  );
});
