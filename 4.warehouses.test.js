const { getToken } = require("./auth.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";
const WAREHOUSE_FILE = path.join(__dirname, "warehouses.json");

let token;
let client;

// ------------------ Before all tests ------------------
beforeAll(async () => {
  token = await getToken();
  // console.log("✅ Token ready:", token);

  client = axios.create({
    baseURL: API_BASE,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
});

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

// ------------------ Save full warehouse object ------------------
function saveWarehouse(warehouse) {
  let data = [];
  if (fs.existsSync(WAREHOUSE_FILE)) {
    data = JSON.parse(fs.readFileSync(WAREHOUSE_FILE, "utf-8"));
    if (!Array.isArray(data)) data = [];
  }
  data.push(warehouse);
  fs.writeFileSync(WAREHOUSE_FILE, JSON.stringify(data, null, 2));
  // console.log(`✅ Warehouse saved in ${WAREHOUSE_FILE}:`, warehouse._id);
}

// ------------------ Create a new warehouse ------------------
async function createWarehouse() {
  try {
    const payload = {
      name: `auto-warehouse-${Date.now()}`,
      location: "tehran",
      capacity: 10000,
      manager: "auto-manager",
    };

    const res = await client.post("/warehouses", payload);
    expect([200, 201]).toContain(res.status);

    const warehouse = res.data.data;
    saveWarehouse(warehouse);

    return warehouse._id;
  } catch (err) {
    logError(err);
  }
}

// ------------------ Test Suite ------------------
describe("Warehouse API E2E", () => {
  test(
    "should create a warehouse and save it",
    async () => {
      const warehouseId = await createWarehouse();
      expect(warehouseId).toBeDefined();
    },
    30000
  );
});
