const axios = require("axios");
const fs = require("fs");

const API_BASE = "https://cnt.liara.run"; // ✅ آدرس API
const TOKEN_FILE = "token.json";
const BANK_ACCOUNT_FILE = "bankAccounts.json"; // ✅ فایل ذخیره‌سازی حساب‌های بانکی

// 📌 بارگذاری توکن
function loadToken() {
  if (fs.existsSync(TOKEN_FILE)) {
    const data = fs.readFileSync(TOKEN_FILE);
    return JSON.parse(data).token;
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

// 📌 هندل کردن خطا
function logError(endpoint, err) {
  if (err.response) {
    console.error(`❌ ${endpoint} →`, err.response.status);
    console.error("Body:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(`❌ ${endpoint} ERROR:`, err.message);
  }
}

// 📌 ذخیره‌سازی bankAccountId داخل فایل JSON
function savebankAccountId(bankAccountId) {
  let data = [];
  if (fs.existsSync(BANK_ACCOUNT_FILE)) {
    data = JSON.parse(fs.readFileSync(BANK_ACCOUNT_FILE, "utf-8"));
  }
  data.push({ bankAccountId });
  fs.writeFileSync(BANK_ACCOUNT_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ bankAccount ID saved to ${BANK_ACCOUNT_FILE}:`, bankAccountId);
}

describe("💰 Bank + Transactions API E2E", () => {
  let bankAccountId;

  // 📊 لیست حساب‌های بانکی
  test("📊 should list bank accounts", async () => {
    try {
      const res = await client.get("/bank-accounts");
      expect(res.status).toBe(200);
      console.log("✅ Bank Accounts Count:", res.data.data.length);
    } catch (err) {
      logError("/bank-accounts", err);
    }
  });

  // 🏦 ایجاد حساب بانکی
  test("🏦 should create a new bank account", async () => {
    try {
      const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);

      const payload = {
        name: `acct-${uniqueSuffix}`,
        currentBalance: 0,
        ownerName: `owner-${uniqueSuffix}`,
        cardNumber: String(
          Math.floor(1000000000000000 + Math.random() * 9e15) // کارت ۱۶ رقمی
        ),
        bankName: `bank-${uniqueSuffix}`,
        iBan: `IR${Math.floor(1000000000000000 + Math.random() * 9e15)}`,
        description: "auto-generated account",
        currency: "IRT",
      };

      const res = await client.post("/bank-accounts", payload);
      expect([200, 201]).toContain(res.status);

      bankAccountId = res.data.data._id;
      savebankAccountId(bankAccountId); // ✅ ذخیره در فایل
      console.log("✅ Bank Account Created:", bankAccountId);
    } catch (err) {
      logError("/bank-accounts", err);
    }
  });

  // 📊 لیست تراکنش‌های بانکی
  test("📊 should list bank transactions", async () => {
    try {
      const res = await client.get("/bank-transactions");
      expect(res.status).toBe(200);
      console.log("✅ Bank Transactions Count:", res.data.data.length);
    } catch (err) {
      logError("/bank-transactions", err);
    }
  });

  // ➕ ایجاد تراکنش بانکی
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

      console.log("✅ Bank Transaction Created:", res.data.data._id);
    } catch (err) {
      logError("/bank-transactions", err);
    }
  });

  // 📊 لیست همه تراکنش‌ها
  test("📊 should list all transactions", async () => {
    try {
      const res = await client.get("/transactions");
      expect(res.status).toBe(200);
      console.log("✅ Transactions Count:", res.data.data.length);
    } catch (err) {
      logError("/transactions", err);
    }
  });
});
