// bank-transactions.e2e.test.js
const axios = require("axios");
const fs = require("fs");
jest.setTimeout(60000); // 60 ثانیه timeout برای تست

const API_BASE = "https://cnt.liara.run";
const TOKEN_FILE = "token.json"; // فایل حاوی توکن

// ------------------ Helpers ------------------
function loadToken() {
  if (fs.existsSync(TOKEN_FILE)) {
    const data = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8"));
    return data.token;
  }
  throw new Error("❌ No token found! Run auth.test.js first to generate token.");
}

const AUTH_TOKEN = `Bearer ${loadToken()}`;
const client = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    Authorization: AUTH_TOKEN,
    "Content-Type": "application/json",
  },
});

function logError(endpoint, err) {
  if (err.response) {
    console.error(`❌ ${endpoint} →`, err.response.status);
    console.error("Body:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(`❌ ${endpoint} ERROR:`, err.message);
  }
  throw err;
}

// ------------------ Get or create active bank account ------------------
async function getOrCreateBankAccount() {
  try {
    const res = await client.get("/bank-accounts?pageSize=50&page=1");
    const accounts = res.data.data || [];

    let active = accounts.find(acc => acc.status === "active" || !acc.status);
    if (active) {
      console.log("✅ Using existing active Bank Account ID:", active._id);
      return active._id;
    }

    // اگر حساب فعال نبود، حساب جدید بساز
    const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
    const payload = {
      name: `acct-${uniqueSuffix}`,
      currentBalance: 0,
      ownerName: `owner-${uniqueSuffix}`,
      cardNumber: String(Math.floor(1000000000000000 + Math.random() * 9e15)),
      bankName: `bank-${uniqueSuffix}`,
      iBan: `IR${Math.floor(1000000000000000 + Math.random() * 9e15)}`,
      description: "Auto-generated account",
      currency: "USD",
    };

    const createRes = await client.post("/bank-accounts", payload);
    console.log("✅ New Bank Account Created:", createRes.data.data._id);
    return createRes.data.data._id;
  } catch (err) {
    logError("/bank-accounts", err);
  }
}

// ------------------ Create transaction ------------------
async function createTransaction(bankAccountId, amount = 1000, type = "deposit") {
  try {
    const payload = {
      bankAccount: bankAccountId,
      amount: String(amount),
      type,
      description: "Test transaction from E2E test",
    };
    const res = await client.post("/bank-transactions", payload);
    console.log("✅ Bank Transaction Created:", res.data.data._id);
    return res.data.data._id;
  } catch (err) {
    logError("/bank-transactions", err);
  }
}

// ------------------ Test Suite ------------------
describe("💰 Bank Transactions API E2E", () => {
  let bankAccountId;

  beforeAll(async () => {
    bankAccountId = await getOrCreateBankAccount();
  });

  test("➕ should create a new bank transaction", async () => {
    const randomAmount = Math.floor(Math.random() * 5000) + 100;
    await createTransaction(bankAccountId, randomAmount, "deposit");
  });

  test("📊 should list all bank transactions", async () => {
    try {
      const res = await client.get("/bank-transactions?pageSize=50&page=1");
      expect(res.status).toBe(200);
      console.log("✅ Bank Transactions Count:", res.data.data.length);
    } catch (err) {
      logError("/bank-transactions", err);
    }
  });
});
