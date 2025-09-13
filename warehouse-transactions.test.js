// warehouse-transactions.test.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getToken } = require("./auth.js"); // ✅ get token dynamically

const API_BASE = "https://cnt.liara.run";
const PRODUCT_FILE = "product.json";
const WAREHOUSE_FILE = "warehouses.json";
const WAREHOUSE_TRANSACTION_FILE = "warehouseTransactions.json";

// ------------------ Load last product ID ------------------
function loadLastProductId() {
  if (!fs.existsSync(PRODUCT_FILE)) throw new Error("❌ product.json not found!");
  const data = JSON.parse(fs.readFileSync(PRODUCT_FILE, "utf-8"));
  if (!Array.isArray(data) || data.length === 0) throw new Error("❌ product.json is empty!");
  const lastProduct = data[data.length - 1];
  return lastProduct._id;
}

// ------------------ Load last 3 warehouses ------------------
function loadLast3Warehouses() {
  if (!fs.existsSync(WAREHOUSE_FILE)) throw new Error("❌ warehouses.json not found!");
  const data = JSON.parse(fs.readFileSync(WAREHOUSE_FILE, "utf-8"));
  if (!Array.isArray(data) || data.length < 3) throw new Error("❌ Need at least 3 warehouses!");
  return data.slice(-3); // last 3 warehouses
}

// ------------------ Save warehouse transaction ------------------
function saveWarehouseTransaction(transaction) {
  let data = [];
  if (fs.existsSync(WAREHOUSE_TRANSACTION_FILE)) {
    data = JSON.parse(fs.readFileSync(WAREHOUSE_TRANSACTION_FILE, "utf-8"));
    if (!Array.isArray(data)) data = [];
  }
  data.push(transaction);
  fs.writeFileSync(WAREHOUSE_TRANSACTION_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ Warehouse transaction saved: ${transaction._id}`);
}

// ------------------ Error logging ------------------
function logError(endpoint, err) {
  if (err.response) {
    console.error(`❌ ${endpoint} →`, err.response.status);
    console.error("Body:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(`❌ ${endpoint} ERROR:`, err.message);
  }
}

// ------------------ Test Suite ------------------
describe("warehouse-transactions API E2E", () => {
  let client;
  let productId;
  let warehouses;

  beforeAll(async () => {
    // 📌 Get fresh token
    const token = await getToken();
    console.log("✅ Token ready:", token);

    client = axios.create({
      baseURL: API_BASE,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    productId = loadLastProductId();
    warehouses = loadLast3Warehouses();
    console.log("✅ Last product ID:", productId);
    console.log("✅ Last 3 warehouses IDs:", warehouses.map(w => w._id));
  });

  test(
    "should create a new warehouse transaction using last product and warehouses",
    async () => {
      try {
        const [w1, w2, w3] = warehouses;

        const payload = {
          quantity: 1,
          description: `test-${Date.now()}`,
          batchNumber: `batch-${Date.now()}`,
          product: productId,
          warehouse: w1._id,
          movedFrom: w2._id,
          movedTo: w3._id,
          date: new Date().toISOString(),
          destination: "test-destination",
          reason: "test-reason",
          price: 100,
          transactionType: "entry",
        };

        const res = await client.post("/warehouse-transactions", payload);
        expect([200, 201]).toContain(res.status);

        const createdTransaction = res.data.data;
        console.log("✅ Warehouse-transaction created:", createdTransaction._id);

        saveWarehouseTransaction(createdTransaction);
      } catch (err) {
        logError("/warehouse-transactions", err);
      }
    },
    30000
  );
});
