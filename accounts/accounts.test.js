const axios = require("axios");
const { getToken } = require("../auth/auth.js");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://cnt.liara.run";

function randomString(prefix) {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
}

function randomPhone() {
  return "09" + Math.floor(100000000 + Math.random() * 900000000);
}

function logError(endpoint, err) {
  if (err.response) {
  } else {
  }
  throw err;
}

describe("👤 Accounts API E2E", () => {
  let client;
  let createdAccount;
  let token;

  beforeAll(async () => {
    token = await getToken();

    client = axios.create({
      baseURL: API_BASE,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, 20000);
 

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
    } catch (err) {
      logError("/accounts", err);
    }
  });

  test("should fetch accounts list", async () => {
    try {
      const res = await client.get("/accounts");
      expect(res.status).toBe(200);
    } catch (err) {
      logError("/accounts", err);
    }
  });

 
});
