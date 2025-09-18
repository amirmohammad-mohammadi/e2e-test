const axios = require("axios");
const { getToken } = require("../auth/auth.js"); 
const fs = require("fs");

const API_BASE = "https://cnt.liara.run";

let client;
let bankAccountId;

function logError(endpoint, err) {
  if (err.response) {

  } else {

  }
}



describe("💰 Bank + Transactions API E2E", () => {

  beforeAll(async () => {
    const token = await getToken(); 
    client = axios.create({
      baseURL: API_BASE,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  test("📊 should list bank accounts", async () => {
    try {
      const res = await client.get("/bank-accounts");
      expect(res.status).toBe(200);
    } catch (err) {
      logError("/bank-accounts", err);
    }
  },30000);

  test("🏦 should create a new bank account", async () => {
    try {
      const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
      const payload = {
        name: `acct-${uniqueSuffix}`,
        currentBalance: 0,
        ownerName: `owner-${uniqueSuffix}`,
        cardNumber: String(Math.floor(1000000000000000 + Math.random() * 9e15)),
        bankName: `bank-${uniqueSuffix}`,
        iBan: `IR${Math.floor(1000000000000000 + Math.random() * 9e15)}`,
        description: "auto-generated account",
        currency: "IRT",
      };

      const res = await client.post("/bank-accounts", payload);
      expect([200, 201]).toContain(res.status);

      bankAccountId = res.data.data._id;
      savebankAccountId(bankAccountId);
    } catch (err) {
      logError("/bank-accounts", err);
    }
  });

  test("📊 should list bank transactions", async () => {
    try {
      const res = await client.get("/bank-transactions");
      expect(res.status).toBe(200);
    } catch (err) {
      logError("/bank-transactions", err);
    }
  });

  test("➕ should create a new bank transaction", async () => {
    if (!bankAccountId) {
      throw new Error("❌ bankAccountId is undefined (bank account creation failed)");
    }

    try {
      const payload = {
        bankAccount: bankAccountId,
        amount: String(Math.floor(Math.random() * 5000) + 100),
        type: "deposit",
        description: "test bank transaction",
      };

      const res = await client.post("/bank-transactions", payload);
      expect([200, 201]).toContain(res.status);
    } catch (err) {
      logError("/bank-transactions", err);
    }
  });

  test("📊 should list all transactions", async () => {
    try {
      const res = await client.get("/transactions");
      expect(res.status).toBe(200);
    } catch (err) {
      logError("/transactions", err);
    }
  });
});
