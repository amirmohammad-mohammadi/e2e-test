const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://cnt.liara.run";

// Load token from token.json
const tokenPath = path.join(__dirname, "token.json");
if (!fs.existsSync(tokenPath)) {
  throw new Error("❌ token.json not found! Run auth.test.js first.");
}
const { token } = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
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

describe("Product Groups API E2E", () => {
  let createdGroupId;

  test(
    "should create a new product group",
    async () => {
      try {
        const payload = {
          name: `test-${Date.now()}`,
          description: "test",
        };

        const res = await client.post("/product-groups", payload);

        expect([200, 201]).toContain(res.status);
        expect(res.data.data).toHaveProperty("_id");
        expect(res.data.data).toHaveProperty("name", payload.name);

        createdGroupId = res.data.data._id;
        console.log("✅ ProductGroup created:", createdGroupId);
      } catch (err) {
        logError(err);
      }
    },
    20000
  );
});
