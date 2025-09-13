// banks.test.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getToken } = require("./auth.js"); // 📌 always get fresh token

const API_BASE = "https://cnt.liara.run";
const BANK_FILE = path.join(__dirname, "banks.json");

// ------------------ Error logging ------------------
function logError(err) {
  if (err.response) {
    console.error("STATUS:", err.response.status);
    console.error("BODY:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error("ERROR:", err.message);
  }
  throw err;
}

// ------------------ Save complete bank object (append) ------------------
function saveBank(bank) {
  let data = [];
  if (fs.existsSync(BANK_FILE)) {
    data = JSON.parse(fs.readFileSync(BANK_FILE, "utf-8"));
    if (!Array.isArray(data)) data = [];
  }
  data.push(bank);
  fs.writeFileSync(BANK_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ Bank saved in ${BANK_FILE}:`, bank._id);
}

// ------------------ Random helpers ------------------
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString(prefix = "", length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + str;
}

// ------------------ Test Suite ------------------
describe("Banks API E2E with full object storage", () => {
  let createdBank;
  let client;

  // 📌 Get fresh token and create axios client before all tests
  beforeAll(async () => {
    const token = await getToken();
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

  test(
    "should create a new bank and save full object",
    async () => {
      try {
        const payload = {
          name: randomString("Bank-"),
          ownerName: randomString("Owner-"),
          cardNumber: `${randomInt(1000000000000000, 9999999999999999)}`,
          bankName: randomString("BankName-"),
          iBan: `IR${randomInt(1000000000000000, 9999999999999999)}`,
          accountNumber: `${randomInt(1000000000, 9999999999)}`,
          currentBalance: randomInt(100000, 10000000),
          description: randomString("Desc-", 10),
          invoiceCurrency: "IRT",
        };

        const res = await client.post("/banks", payload);
        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("data._id");

        createdBank = res.data.data;
        saveBank(createdBank);
        console.log("✅ Bank created:", createdBank._id);
      } catch (err) {
        logError(err);
      }
    },
    30000
  );

  test(
    "should list banks",
    async () => {
      try {
        const res = await client.get("/banks");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data.data)).toBe(true);
        console.log("✅ Banks list (IDs):", res.data.data.map(b => b._id));
      } catch (err) {
        logError(err);
      }
    },
    30000
  );

  test(
    "should get one bank by ID",
    async () => {
      if (!createdBank) return;
      try {
        const res = await client.get(`/banks/${createdBank._id}`);
        expect(res.status).toBe(200);
        expect(res.data.data).toHaveProperty("_id", createdBank._id);
      } catch (err) {
        logError(err);
      }
    },
    30000
  );

  test(
    "should update the bank",
    async () => {
      if (!createdBank) return;
      try {
        const updatedPayload = {
          name: randomString("Updated-"),
          description: randomString("UpdatedDesc-", 8),
        };
        const res = await client.put(`/banks/${createdBank._id}`, updatedPayload);
        expect(res.status).toBe(200);
        expect(res.data.data).toHaveProperty("name", updatedPayload.name);
      } catch (err) {
        logError(err);
      }
    },
    30000
  );

  test(
    "should delete the bank",
    async () => {
      if (!createdBank) return;
      try {
        const res = await client.delete(`/banks/${createdBank._id}`);
        expect(res.status).toBe(200);
        expect(res.data.data).toHaveProperty("isDeleted", true);
        expect(res.data.data).toHaveProperty("deletedAt");
      } catch (err) {
        logError(err);
      }
    },
    30000
  );
});
