// tags.test.js
const { getToken } = require("./auth.js"); // ✅ get token dynamically
const axios = require("axios");
const fs = require("fs");
const TAG_FILE = "tags.json";
const API_BASE = "https://cnt.liara.run";

let token;
let client;

// ------------------ before all tests ------------------
beforeAll(async () => {
  // 📌 Always get fresh token from auth.test.js
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

// ------------------ Helpers ------------------
function saveTag(tag) {
  let data = [];
  if (fs.existsSync(TAG_FILE)) {
    data = JSON.parse(fs.readFileSync(TAG_FILE, "utf-8"));
    if (!Array.isArray(data)) data = [];
  }
  data.push(tag);
  fs.writeFileSync(TAG_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ Tag saved in ${TAG_FILE}:`, tag._id);
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

jest.setTimeout(20000);

// ------------------ Test Suite ------------------
describe("Tags API E2E", () => {
  let createdTag;

  test("🆕 should create a tag", async () => {
    try {
      const payload = { label: `tag-${Date.now()}`, type: "account" };
      const res = await client.post("/tags", payload);

      expect([200, 201]).toContain(res.status);
      expect(res.data.data).toHaveProperty("_id");
      expect(res.data.data).toHaveProperty("label", payload.label);

      createdTag = res.data.data;
      saveTag(createdTag);
    } catch (err) {
      logError("/tags", err);
    }
  });

  test("📋 should list tags", async () => {
    try {
      const res = await client.get("/tags");
      expect([200, 201]).toContain(res.status);
      expect(Array.isArray(res.data.data)).toBe(true);

      console.log("📋 Tags list (first 3):", res.data.data.slice(0, 3));
    } catch (err) {
      logError("/tags", err);
    }
  });

  test("✏️ should update the created tag", async () => {
    try {
      const res = await client.put(`/tags/${createdTag._id}`, { label: "updated-label" });
      expect([200, 201]).toContain(res.status);
      expect(res.data.data).toHaveProperty("acknowledged", true);
    } catch (err) {
      logError(`/tags/${createdTag._id}`, err);
    }
  });

  test("🗑️ should delete the created tag", async () => {
    try {
      const res = await client.delete(`/tags/${createdTag._id}`);
      expect([200, 202]).toContain(res.status);
      expect(res.data.data).toHaveProperty("acknowledged", true);
    } catch (err) {
      logError(`/tags/${createdTag._id}`, err);
    }
  });
});
