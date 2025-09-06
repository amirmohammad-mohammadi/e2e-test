const fs = require("fs");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";
const TOKEN_FILE = "token.json";

// Read token from file
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

describe("Warehouse API E2E", () => {
  let createdWarehouseId;

  test(
    "should create a new warehouse",
    async () => {
      try {
        const payload = {
          name: `test-${Date.now()}`,
          location: "tehran",
          capacity: 10000,
          manager: "hassan",
        };

        const res = await client.post("/warehouses", payload);

        expect([200, 201]).toContain(res.status);
        expect(res.data.data).toHaveProperty("_id");
        expect(res.data.data).toHaveProperty("name", payload.name);

        createdWarehouseId = res.data.data._id;
        console.log("✅ Warehouse created:", createdWarehouseId);
      } catch (err) {
        logError(err);
      }
    },
    20000
  );
});
