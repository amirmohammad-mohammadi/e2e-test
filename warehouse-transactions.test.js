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

describe("warehouse-transactions API E2E", () => {
  test("should create a new warehouse-transaction", async () => {
    try {

      const productRes = await client.get("/products");
      const productId = productRes.data?.data?.[0]?._id;
      if (!productId) throw new Error("❌ هیچ productی پیدا نشد!");

      const warehouseRes = await client.get("/warehouses");
      const warehouses = warehouseRes.data?.data;
      if (!warehouses || warehouses.length < 3) {
        throw new Error("❌ حداقل 3 warehouse نیاز داریم!");
      }

      const [w1, w2, w3] = warehouses;

  
      const uniqueDesc = `test-${Date.now()}`;
      const payload = {
        quantity: 1,
        description: uniqueDesc,
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


      const postRes = await client.post("/warehouse-transactions", payload);
      expect([200, 201]).toContain(postRes.status);


      const txRes = await client.get("/warehouse-transactions");
      expect(txRes.status).toBe(200);

      const allTransactions = txRes.data?.data || [];
      const found = allTransactions.find(
        (tx) => tx.description === uniqueDesc
      );

      if (!found) {
        throw new Error(
          "❌ نتونستیم transaction ساخته‌شده رو پیدا کنیم. Response: " +
            JSON.stringify(allTransactions)
        );
      }


expect(found).toHaveProperty("_id");
expect(found.product).toBeDefined();
expect(found.product._id).toBe(productId);
expect(found.warehouse._id).toBe(w1._id);
expect(found.description).toBe(uniqueDesc);


    } catch (err) {
      logError(err);
    }
  }, 30000);
});
