// bank-transactions.test.js
const { getToken } = require("./auth.js");
const axios = require("axios");
const fs = require("fs");

jest.setTimeout(30000); // کل تست‌ها 30 ثانیه timeout

const API_BASE = "https://cnt.liara.run";
const BANK_TRANSACTIONS_FILE = "bankTransactions.json";

let client;
let token;

// ------------------ قبل از همه تست‌ها ------------------
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
}, 30000);

// ------------------ Error logging ------------------
function logError(endpoint, err) {
  if (err.response) {
    console.error(`❌ ${endpoint} →`, err.response.status);
    console.error("Body:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(`❌ ${endpoint} ERROR:`, err.message);
  }
  throw err;
}

// ------------------ Save transaction ------------------
function saveTransaction(transaction) {
  let data = [];
  if (fs.existsSync(BANK_TRANSACTIONS_FILE)) {
    data = JSON.parse(fs.readFileSync(BANK_TRANSACTIONS_FILE, "utf-8"));
    if (!Array.isArray(data)) data = [];
  }
  data.push(transaction);
  fs.writeFileSync(BANK_TRANSACTIONS_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ Transaction saved: ${transaction._id}`);
}

// ------------------ Get first active bank account from API ------------------
async function getActiveBankAccountId() {
  try {
    const res = await client.get("/bank-accounts?pageSize=50&page=1");
    const accounts = res.data.data;

    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error("❌ No bank accounts found in API. Create one first.");
    }

    // فقط حساب‌های فعال (فرض بر اینه فیلد status وجود داره)
    const activeAccounts = accounts.filter(acc => acc.status === "active" || !acc.status);
    if (activeAccounts.length === 0) {
      throw new Error("❌ No active bank accounts found in API.");
    }

    const selectedAccount = activeAccounts[0]; // اولین حساب فعال
    console.log("✅ Using system bank account ID:", selectedAccount._id);
    return selectedAccount._id;
  } catch (err) {
    logError("/bank-accounts", err);
  }
}

// ------------------ Test Suite ------------------
describe("💰 Bank Transactions API E2E", () => {
  let bankAccountId;
  let transactionId;

  beforeAll(async () => {
    bankAccountId = await getActiveBankAccountId(); // گرفتن یک حساب واقعی و فعال
  }, 30000);

  test(
    "➕ should create a new bank transaction",
    async () => {
      const payload = {
        bankAccount: bankAccountId,
        amount: String(Math.floor(Math.random() * 5000) + 100),
        type: "deposit",
        description: "test bank transaction",
      };

      try {
        const res = await client.post("/bank-transactions", payload);
        expect([200, 201]).toContain(res.status);

        transactionId = res.data.data._id;
        console.log("✅ Bank Transaction Created:", transactionId);

        saveTransaction(res.data.data);
      } catch (err) {
        logError("/bank-transactions", err);
      }
    },
    30000
  );

  test(
    "📊 should fetch transactions list",
    async () => {
      try {
        const res = await client.get("/transactions?pageSize=50&page=1");
        expect(res.status).toBe(200);
        console.log("✅ Transactions Count:", res.data.data.length);
      } catch (err) {
        logError("/transactions", err);
      }
    },
    30000
  );
});
