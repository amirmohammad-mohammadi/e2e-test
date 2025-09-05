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

describe("Invoices API E2E", () => {
  let createdInvoiceId;

  test("should create a new invoice", async () => {
    try {
      
      const warehouseRes = await client.get("/warehouses");
      const warehouseId = warehouseRes.data.data[0]._id;

     
      const accountRes = await client.get("/accounts");
      const accountId = accountRes.data.data[0]._id;

      
      const bankRes = await client.get("/banks");
      const bankId = bankRes.data.data[0]._id;

     
      const bankAccountRes = await client.get("/bank-accounts");
      const bankAccountId = bankAccountRes.data.data[0]._id;

      
      const payload = {
        description: "black t-shirt sell",
        invoiceType: "sell",
        status: "draft", 
        paymentStatus: "paid",
        tax: 3,
        discountValue: 0,
        discountType: "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: "black t-shirt",
            price: 100,
            extraCost: 100,
            discountValue: 0,
            discountType: "fix",
            tax: 10,
            quantity: 5,
            triggerWareHouseTransaction: true,
            product: "68b7d99784408c6bf5629984", 
            requestedProductFromWarehouse: [
              {
                productQuantity: 10,
                warehouse: warehouseId, 
              },
            ],
            isJewelryInvoiceProduct: true,
            jewelryMakingCharges: 0,
          },
        ],
        account: accountId, 
        banks: [bankId], 
        bankAccount: bankAccountId, 
        paymentItems: [
          {
            paymentType: "bank_transfer",
            dateTime: new Date().toISOString(),
            amount: 500000,
            description: "Payment for black t-shirts",
            bankName: "Bank Name",
            checkNumber: "123456",
            payee: "Ahmad",
            status: "pending",
          },
        ],
      };

     
      const res = await client.post("/invoices", payload);

     
      expect([200, 201]).toContain(res.status);
      expect(res.data.data).toHaveProperty("_id");
      expect(res.data.data).toHaveProperty("description", payload.description);
      expect(res.data.data).toHaveProperty("invoiceType", payload.invoiceType);
      
      expect(res.data.data).toHaveProperty("status", "draft");
      expect(res.data.data).toHaveProperty(
        "paymentStatus",
        payload.paymentStatus
      );

      createdInvoiceId = res.data.data._id; 
    } catch (err) {
      logError(err);
    }
  }, 20000); 
});
