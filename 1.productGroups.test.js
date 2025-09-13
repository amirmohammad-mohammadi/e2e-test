// 1.productGroups.test.js
const { getToken } = require("./auth.js"); // 📌 always get new token
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://cnt.liara.run";

let token;

// ------------------ Before all tests ------------------
beforeAll(async () => {
  token = await getToken();
  console.log("✅ Token ready for ProductGroups tests:", token);
});

// ------------------ Helper: create product group ------------------
async function createProductGroup(token) {
  const client = axios.create({
    baseURL: API_BASE,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const payload = {
    name: `test-${Date.now()}`,
    description: "test",
  };

  const res = await client.post("/product-groups", payload);

  expect([200, 201]).toContain(res.status);
  expect(res.data.data).toHaveProperty("_id");
  expect(res.data.data).toHaveProperty("name", payload.name);

  console.log("✅ ProductGroup created:", res.data.data._id);
  return res.data.data._id;
}

// ------------------ Test Suite ------------------
describe("Product Groups API E2E", () => {
  test(
    "should create product group with fresh token",
    async () => {
      // always get fresh token before test
      token = await getToken();
      const groupId = await createProductGroup(token);
      expect(groupId).toBeDefined();
    },
    60000
  );
});
