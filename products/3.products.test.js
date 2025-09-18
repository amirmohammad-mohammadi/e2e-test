const { getToken } = require("../auth/auth.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://cnt.liara.run";

let token;
let client;

beforeAll(async () => {
  token = await getToken();

  client = axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
});

function logError(err) {
  if (err.response) {

  } else {
  }
  throw err;
}



describe("Products API E2E", () => {
  let createdProduct;

  test(
    "should create a new product and save full object",
    async () => {
      try {
        const warehousesRes = await client.get("/warehouses");
        expect(warehousesRes.status).toBe(200);
        expect(Array.isArray(warehousesRes.data.data)).toBe(true);

        if (warehousesRes.data.data.length === 0) {
          throw new Error("❌ No warehouses available to assign product.");
        }

        const warehouseId = warehousesRes.data.data[0]._id;

        const payload = {
          name: `test-${Date.now()}`,
          description: "test product",
          unit: "30",
          pricePerCurrency: [
            {
              currencyDetails: {
                purchasePriceCurrency: "IRT",
                purchaseCurrencyRateToBase: 1,
                baseCurrency: "IRT",
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

        
        const res = await client.post("/products", payload);
        expect([200, 201]).toContain(res.status);
        expect(res.data.data).toHaveProperty("_id");

        createdProduct = res.data.data;

      } catch (err) {
        logError(err);
      }
    },
    30000
  );
});
