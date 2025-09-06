const axios = require("axios");
const fs = require("fs");
const TOKEN_FILE = "token.json";

function loadToken() {
  if (fs.existsSync(TOKEN_FILE)) {
    const data = fs.readFileSync(TOKEN_FILE);
    return JSON.parse(data).token;
  }
  throw new Error("❌ No token found! Run auth.test.js first to generate token.");
}


const AUTH_TOKEN = `Bearer ${loadToken()}`;


const API_BASE = "https://cnt.liara.run";

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

describe("Products API E2E", () => {
  let createdProductId;

  test(
    "should create a new product (with warehouse id from API)",
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
          description: "test2",
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

        const res = await client.post("/products", payload);

        expect([200, 201]).toContain(res.status);
        expect(res.data.data).toHaveProperty("_id");
        createdProductId = res.data.data._id;
      } catch (err) {
        logError(err);
      }
      console.log("✅ Product created:", createdProductId);

    },
    20000
  );const axios = require("axios");
  const fs = require("fs");
  const TOKEN_FILE = "token.json";
  
  function loadToken() {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = fs.readFileSync(TOKEN_FILE);
      return JSON.parse(data).token;
    }
    throw new Error("❌ No token found! Run auth.test.js first to generate token.");
  }
  
  const AUTH_TOKEN = `Bearer ${loadToken()}`;
  const API_BASE = "https://cnt.liara.run";
  
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
  
  describe("Products API E2E", () => {
    let createdProductId;
  
    test(
      "should create a new product (with warehouse id from API)",
      async () => {
        try {
          // get warehouses
          const warehousesRes = await client.get("/warehouses");
          expect(warehousesRes.status).toBe(200);
          expect(Array.isArray(warehousesRes.data.data)).toBe(true);
  
          if (warehousesRes.data.data.length === 0) {
            throw new Error("❌ No warehouses available to assign product.");
          }
  
          const warehouseId = warehousesRes.data.data[0]._id;
  
          // create product payload
          const payload = {
            name: `test-${Date.now()}`,
            description: "test2",
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
  
          // create product
          const res = await client.post("/products", payload);
  
          expect([200, 201]).toContain(res.status);
          expect(res.data.data).toHaveProperty("_id");
          createdProductId = res.data.data._id;
  
          console.log("✅ Product created:", createdProductId);
  
          // get products list
          const productsRes = await client.get("/products");
          expect(productsRes.status).toBe(200);
          expect(Array.isArray(productsRes.data.data)).toBe(true);
  
          if (productsRes.data.data.length > 0) {
            const firstProductId = productsRes.data.data[0]._id;
            console.log("📦 First product id from list:", firstProductId);
          } else {
            console.warn("⚠️ No products found in list.");
          }
        } catch (err) {
          logError(err);
        }
      },
      20000
    );
  });
  
});
