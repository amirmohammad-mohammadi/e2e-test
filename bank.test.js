const axios = require("axios");

const API_BASE = "https://cnt.liara.run";
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

describe("Banks API E2E", () => {
  let createdBankId;

  test(
    "should create a new bank",
    async () => {
      try {
        const payload = {
          name: `test-${Date.now()}`,
          ownerName: `test-${Date.now()}`,
          cardNumber: "123456789",
          bankName: `test-${Date.now()}`,
          iBan: "IR123456789",
          accountNumber: "1235464894568653",
          currentBalance: "1200000",
          description: "test",
          invoiceCurrency: "IRT",
        };

        const res = await client.post("/banks", payload);

        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("data._id");
        createdBankId = res.data.data._id;
      } catch (err) {
        logError(err);
      }
    },
    20000 
  );

  test(
    "should get list of banks",
    async () => {
      try {
        const res = await client.get("/banks");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data.data)).toBe(true);
      } catch (err) {
        logError(err);
      }
    },
    20000
  );

  test(
    "should get one bank by id",
    async () => {
      if (!createdBankId) return; 
      try {
        const res = await client.get(`/banks/${createdBankId}`);
        expect(res.status).toBe(200);
        expect(res.data.data).toHaveProperty("_id", createdBankId);
      } catch (err) {
        logError(err);
      }
    },
    20000
  );

  test(
    "should update a bank",
    async () => {
      if (!createdBankId) return;
      try {
        const updatedPayload = {
          name: `updated-${Date.now()}`,
          description: "updated description",
        };
        const res = await client.put(`/banks/${createdBankId}`, updatedPayload);
        expect(res.status).toBe(200);
        expect(res.data.data).toHaveProperty("name", updatedPayload.name);
      } catch (err) {
        logError(err);
      }
    },
    20000
  );

  test(
    "should delete a bank",
    async () => {
      if (!createdBankId) return;
      try {
        const res = await client.delete(`/banks/${createdBankId}`);
        expect(res.status).toBe(200);
        expect(res.data.data).toHaveProperty("isDeleted", true);
        expect(res.data.data).toHaveProperty("deletedAt");
      } catch (err) {
        logError(err);
      }
    },
    20000
  );
});
