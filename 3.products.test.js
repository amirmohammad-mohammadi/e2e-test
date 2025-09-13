// products.test.js
const { getToken } = require("./auth.js"); // Always get new token
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const PRODUCT_FILE = "product.json"; // File to save products
const API_BASE = "https://cnt.liara.run";

let token;
let client;

// ------------------ Before all tests ------------------
beforeAll(async () => {
  token = await getToken();
  console.log("✅ Token ready:", token);

  // Create axios client with fresh token
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

// ------------------ Save full product object ------------------
function saveProduct(product) {
  let data = [];
  if (fs.existsSync(PRODUCT_FILE)) {
    data = JSON.parse(fs.readFileSync(PRODUCT_FILE, "utf-8"));
    if (!Array.isArray(data)) data = [];
  }
  data.push(product);
  fs.writeFileSync(PRODUCT_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ Product saved in ${PRODUCT_FILE}:`, product._id);
}

// ------------------ Test Suite ------------------
describe("Products API E2E", () => {
  let createdProduct;

  test(
    "should create a new product and save full object",
    async () => {
      try {
        // Get list of warehouses
        const warehousesRes = await client.get("/warehouses");
        expect(warehousesRes.status).toBe(200);
        expect(Array.isArray(warehousesRes.data.data)).toBe(true);

        if (warehousesRes.data.data.length === 0) {
          throw new Error("❌ No warehouses available to assign product.");
        }

        const warehouseId = warehousesRes.data.data[0]._id;

        // Prepare product payload
        const payload = {
          name: `test-${Date.now()}`,
          description: "test product",
          unit: "30",
          pricePerCurrency: [
            {
              currencyDetails: {
                purchasePriceCurrency: "USD",
                purchaseCurrencyRateToBase: 1,
                baseCurrency: "USD",
                purchasePriceFormula: "10",
                sell1PriceFormula: "15",
                sell2PriceFormula: "20",
              },
              extraCost: 0,
              purchasePrice: 100,
              sellPrice1: 120,
              sellPrice2: 130,
              sellPrice3: 140,
              isDefault: true,
              jewelryMakingCharges: 0,
              jewelryTax: 0,
            },
          ],
          warehouses: [
            {
              warehouseId,
              productQuantity: 100,
            },
          ],
        };

        // Create product
        const res = await client.post("/products", payload);
        expect([200, 201]).toContain(res.status);
        expect(res.data.data).toHaveProperty("_id");

        createdProduct = res.data.data;
        saveProduct(createdProduct);

        console.log("✅ Product created:", createdProduct._id);
      } catch (err) {
        logError(err);
      }
    },
    30000
  );
});
