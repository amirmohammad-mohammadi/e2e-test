const axios = require("axios");
const { getToken } = require("../auth/auth.js");

const API_BASE = "https://cnt.liara.run";

function logError(err) {
  if (err.response) {
  
  } else {
  }
  throw err;
}

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

describe("Banks API E2E with API only", () => {
  let createdBank;
  let client;

  beforeAll(async () => {
    const token = await getToken();
    client = axios.create({
      baseURL: API_BASE,
      headers: {
        Authorization: `Bearer ${token}`,
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
  cardNumber: randomInt(10000000, 99999999).toString(),   
  bankName: randomString("BankName-"),
  iBan: randomString("IR", 16),                         
  accountNumber: randomInt(100000, 9999999).toString(), 
  totalTransactionsAmount: randomInt(1000, 1000000),        
  currentBalance: randomInt(100000, 10000000).toString(),   
  description: randomString("Desc-", 10),
  invoiceCurrency: randomString("", 3),                   
  isDeleted: Math.random() < 0.5,                         
  deletedAt: new Date(Date.now() - randomInt(0, 1000000000)).toISOString(), 
};


        const res = await client.post("/banks", payload);
        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("data._id");

        createdBank = res.data.data;
  
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
      } catch (err) {
        logError(err);
      }
    },
    300000
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
      } catch (err) {
        logError(err);
      }
    },
    30000
  );
});
