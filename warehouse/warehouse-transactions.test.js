const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getToken } = require("../auth/auth.js");

const API_BASE = "https://cnt.liara.run";


function logError(endpoint, err) {
  if (err.response) {
  } else {
  }
}

describe("warehouse-transactions API E2E", () => {

  let client;
  let productId;
  let warehouses;

  beforeAll(async () => {
    const token = await getToken();

    client = axios.create({
      baseURL: API_BASE,
      headers: {
     
        Authorization: `Bearer ${token}`,
      
      },
    });

const productRes = await client.get("/products?pageSize=50&page=1");
    product = productRes.data.data.slice(-1)[0];  

const warehouseRes = await client.get("/warehouses?pageSize=50&page=1");
    warehouses = warehouseRes.data.data.slice(-1)[0];  });

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

        saveWarehouseTransaction(createdTransaction);
      } catch (err) {
        logError("/warehouse-transactions", err);
      }
    },
    30000
  );
});
