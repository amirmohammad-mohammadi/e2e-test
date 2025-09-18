const { getToken } = require("../auth/auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let token;
let client;

function logError(endpoint, err) {
  if (err.response) {
  } else {
  }
}


describe("📦 Categories API E2E", () => {
  let categoryId;
  let lastBankAccountId;

  beforeAll(async () => {
    try {
      token = await getToken();
      client = axios.create({
        baseURL: API_BASE,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

 
      const bankAccountsRes = await client.get("/bank-accounts");
      const bankAccounts = bankAccountsRes.data.data;
      if (!Array.isArray(bankAccounts) || bankAccounts.length === 0) {
        throw new Error("❌ No bank accounts found from API");
      }
      lastBankAccountId = bankAccounts[bankAccounts.length - 1]._id;
 

    } catch (err) {
      logError("Setup token/client/bankAccounts", err);
      throw err; 
    }
  }, 30000);


  test("➕ should create a new category", async () => {
    try {
      const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);

      const payload = {
        name: `cat-${uniqueSuffix}`,
        description: `description-${uniqueSuffix}`,
        parentCategory: null,
        isAssignableToProduct: Math.random() < 0.5,
        assignedBankAccount: lastBankAccountId,
      };

      const res = await client.post("/categories", payload);
      expect([200, 201]).toContain(res.status);

      categoryId = res.data.data._id;

    } catch (err) {
      logError("/categories", err);
      throw err;
    }
  });


  test("📊 should fetch categories list", async () => {
    try {
      const res = await client.get("/categories");
      expect(res.status).toBe(200);
   
    } catch (err) {
      logError("/categories", err);
      throw err;
    }
  });

  test("🔍 should fetch created category by ID", async () => {
    if (!categoryId) throw new Error("❌ categoryId is undefined (category creation failed)");

    try {
      const res = await client.get(`/categories/${categoryId}`);
      expect(res.status).toBe(200);
    } catch (err) {
      logError(`/categories/${categoryId}`, err);
      throw err;
    }
  });
});
