const axios = require("axios");


const API_BASE = "https://cnt.liara.run";
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjZkNWM3ODQ0MDhjNmJmNTYyOThiMiIsImRhdGUiOiIyMDI1LTA5LTA1VDA2OjEyOjUzLjU0M1oiLCJpYXQiOjE3NTcwNTI3NzN9.dmQv28TFU2UE-RoyfHFc0vcE6WHWYi_oqe1Ib8_O8pc";

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
    },
    20000
  );
});
