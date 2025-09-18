// 1.productGroups.test.js
const { getToken } = require("../auth/auth.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://cnt.liara.run";

let token;

beforeAll(async () => {
  token = await getToken();
});

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

  return res.data.data._id;
}

describe("Product Groups API E2E", () => {
  test(
    "should create product group with fresh token",
    async () => {
      token = await getToken();
      const groupId = await createProductGroup(token);
      expect(groupId).toBeDefined();
    },
    60000
  );
});
