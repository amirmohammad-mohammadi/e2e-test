const { getToken } = require("./auth.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";
const ACCOUNT_FILE = path.join(__dirname, "account.json");

// ------------------ Helpers ------------------
function randomString(prefix) {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
}

function randomPhone() {
  return "09" + Math.floor(100000000 + Math.random() * 900000000);
}

function logError(endpoint, err) {
  if (err.response) {
    console.error(`❌ ${endpoint} →`, err.response.status);
    console.error("Body:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(`❌ ${endpoint} ERROR:`, err.message);
  }
  throw err;
}

function saveAccount(account) {
  let data = [];
  if (fs.existsSync(ACCOUNT_FILE)) {
    data = JSON.parse(fs.readFileSync(ACCOUNT_FILE, "utf-8"));
    if (!Array.isArray(data)) data = [];
  }
  data.push(account);
  fs.writeFileSync(ACCOUNT_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ Account saved in ${ACCOUNT_FILE}:`, account._id);
}

// ------------------ Test Suite ------------------
describe("👤 Accounts API E2E", () => {
  let client;
  let createdAccount;
  let token;

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

  test("should create a new account", async () => {
    const payload = {
      name: randomString("acc"),
      phone: randomPhone(),
      whatsapp: String(randomPhone()),
      phone2: randomPhone(),
      brandName: randomString("brand"),
      province: "68b6bf0984408c6bf562988e",
      city: "68b6bf0984408c6bf562988d",
      address: randomString("address"),
    };

    try {
      const res = await client.post("/accounts", payload);
      expect([200, 201]).toContain(res.status);
      createdAccount = res.data.data;
      console.log("✅ Account Created:", createdAccount._id);
    } catch (err) {
      logError("/accounts", err);
    }
  });

  test("should fetch accounts list", async () => {
    try {
      const res = await client.get("/accounts");
      expect(res.status).toBe(200);
      console.log("✅ Accounts Count:", res.data?.data?.length);
    } catch (err) {
      logError("/accounts", err);
    }
  });

  afterAll(() => {
    if (createdAccount) {
      saveAccount(createdAccount);
    }
  });
});
