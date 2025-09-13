// categories.test.js
const { getToken } = require("./auth.js"); // 📌 always get fresh token
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://cnt.liara.run";
const BANK_ACCOUNTS_FILE = path.join(__dirname, "bankAccounts.json"); // برای گرفتن آخرین حساب بانکی

let token;
let client;

// ------------------ Load last bank account ID ------------------
function loadLastBankAccountId() {
  if (!fs.existsSync(BANK_ACCOUNTS_FILE)) throw new Error("❌ bankAccounts.json not found!");
  const data = JSON.parse(fs.readFileSync(BANK_ACCOUNTS_FILE, "utf-8"));
  if (!Array.isArray(data) || data.length === 0) throw new Error("❌ No bank accounts found in bankAccounts.json");
  return data[data.length - 1]._id; // آخرین حساب بانکی
}

// ------------------ Error logging ------------------
function logError(endpoint, err) {
  if (err.response) {
    console.error(`❌ ${endpoint} →`, err.response.status);
    console.error("Body:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(`❌ ${endpoint} ERROR:`, err.message);
  }
}

// ------------------ Test Suite ------------------
describe("📦 Categories API E2E", () => {
  let categoryId;
  let lastBankAccountId;

  // 📌 Get fresh token and create Axios client before all tests
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

    lastBankAccountId = loadLastBankAccountId();
    console.log("✅ Last bank account ID:", lastBankAccountId);
  });

  // ➕ Create a category
  test("➕ should create a new category", async () => {
    try {
      const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);

      const payload = {
        name: `cat-${uniqueSuffix}`,
        description: `description-${uniqueSuffix}`,
        parentCategory: null,
        isAssignableToProduct: Math.random() < 0.5,
        assignedBankAccount: lastBankAccountId
      };

      const res = await client.post("/categories", payload);
      expect([200, 201]).toContain(res.status);

      categoryId = res.data.data._id;
      console.log("✅ Category Created:", categoryId);
    } catch (err) {
      logError("/categories", err);
    }
  });

  // 📊 Fetch categories list
  test("📊 should fetch categories list", async () => {
    try {
      const res = await client.get("/categories");
      expect(res.status).toBe(200);
      console.log("✅ Categories Count:", res.data.data.length);
    } catch (err) {
      logError("/categories", err);
    }
  });

  // 🔍 Fetch created category by ID
  test("🔍 should fetch created category by ID", async () => {
    if (!categoryId) throw new Error("❌ categoryId is undefined (category creation failed)");

    try {
      const res = await client.get(`/categories/${categoryId}`);
      expect(res.status).toBe(200);
      console.log("✅ Category Fetched:", res.data.data.name);
    } catch (err) {
      logError(`/categories/${categoryId}`, err);
    }
  });
});
