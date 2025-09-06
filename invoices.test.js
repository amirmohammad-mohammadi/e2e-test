// const axios = require("axios");

// const API_BASE = "https://cnt.liara.run";

// const fs = require("fs");
// const TOKEN_FILE = "token.json";

// function loadToken() {
//   if (fs.existsSync(TOKEN_FILE)) {
//     const data = fs.readFileSync(TOKEN_FILE);
//     return JSON.parse(data).token;
//   }
//   throw new Error("❌ No token found! Run auth.test.js first to generate token.");
// }


// const AUTH_TOKEN = `Bearer ${loadToken()}`;
// const client = axios.create({
//   baseURL: API_BASE,
//   headers: {
//     Accept: "application/json",
//     Authorization: AUTH_TOKEN,
//     "Content-Type": "application/json",
//   },
// });

// function logError(err) {
//   if (err.response) {
//     console.error("STATUS:", err.response.status);
//     console.error("BODY:", JSON.stringify(err.response.data, null, 2));
//   } else {
//     console.error("ERROR:", err.message);
//   }
//   throw err; 
// }

// describe("Invoices API E2E", () => {
//   let createdInvoiceId;

//   test("should create a new invoice", async () => {
//     try {
      
//       const warehouseRes = await client.get("/warehouses");
//       const warehouseId = warehouseRes.data.data[0]._id;

     
//       const accountRes = await client.get("/accounts");
//       const accountId = accountRes.data.data[0]._id;

      
//       const bankRes = await client.get("/banks");
//       const bankId = bankRes.data.data[0]._id;

     
//       const bankAccountRes = await client.get("/bank-accounts");
//       const bankAccountId = bankAccountRes.data.data[0]._id;

      
//       const payload = {
//         description: "black t-shirt sell",
//         invoiceType: "sell",
//         status: "draft", 
//         paymentStatus: "paid",
//         tax: 3,
//         discountValue: 0,
//         discountType: "percentage",
//         currency: "IRT",
//         invoiceProducts: [
//           {
//             name: "black t-shirt",
//             price: 100,
//             extraCost: 100,
//             discountValue: 0,
//             discountType: "fix",
//             tax: 10,
//             quantity: 5,
//             triggerWareHouseTransaction: true,
//             product: "68b7d99784408c6bf5629984", 
//             requestedProductFromWarehouse: [
//               {
//                 productQuantity: 10,
//                 warehouse: warehouseId, 
//               },
//             ],
//             isJewelryInvoiceProduct: true,
//             jewelryMakingCharges: 0,
//           },
//         ],
//         account: accountId, 
//         banks: [bankId], 
//         bankAccount: bankAccountId, 
//         paymentItems: [
//           {
//             paymentType: "bank_transfer",
//             dateTime: new Date().toISOString(),
//             amount: 500000,
//             description: "Payment for black t-shirts",
//             bankName: "Bank Name",
//             checkNumber: "123456",
//             payee: "Ahmad",
//             status: "pending",
//           },
//         ],
//       };

     
//       const res = await client.post("/invoices", payload);

     
//       expect([200, 201]).toContain(res.status);
//       expect(res.data.data).toHaveProperty("_id");
//       expect(res.data.data).toHaveProperty("description", payload.description);
//       expect(res.data.data).toHaveProperty("invoiceType", payload.invoiceType);
      
//       expect(res.data.data).toHaveProperty("status", "draft");
//       expect(res.data.data).toHaveProperty(
//         "paymentStatus",
//         payload.paymentStatus
//       );

//       createdInvoiceId = res.data.data._id; 
//     } catch (err) {
//       logError(err);
//     }
//   }, 20000); 
// });

// invoices.test.js
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

describe("Invoices API E2E", () => {
  let warehouseId, accountId, bankId, bankAccountId, productId;

  beforeAll(async () => {
    try {
      const warehouseRes = await client.get("/warehouses");
      warehouseId = warehouseRes.data.data[0]._id;

      const accountRes = await client.get("/accounts");
      accountId = accountRes.data.data[0]._id;

      const bankRes = await client.get("/banks");
      bankId = bankRes.data.data[0]._id;

      const bankAccountRes = await client.get("/bank-accounts");
      bankAccountId = bankAccountRes.data.data[0]._id;

      const productRes = await client.get("/products");
      productId = productRes.data.data[0]._id;
    } catch (err) {
      logError(err);
    }
  }, 20000);

  const basePayload = {
    description: "Invoice test",
    invoiceType: "sell",
    status: "draft",
    paymentStatus: "paid",
    currency: "IRT",
    invoiceProducts: [],
    account: undefined,
    banks: [],
    bankAccount: undefined,
    paymentItems: [
      {
        paymentType: "bank_transfer",
        dateTime: new Date().toISOString(),
        amount: 500000,
        description: "Test payment",
        bankName: "Bank Name",
        checkNumber: "123456",
        payee: "Ahmad",
        status: "pending",
      },
    ],
  };

  async function createInvoice(productOptions, overrides = {}) {
    const payload = {
      ...basePayload,
      account: accountId,
      banks: [bankId],
      bankAccount: bankAccountId,
      invoiceProducts: [
        {
          name: "black t-shirt",
          price: 100,
          extraCost: 50,
          discountValue: productOptions.discountValue || 0,
          discountType: productOptions.discountType || "fix",
          tax: productOptions.tax || 0,
          quantity: 5,
          triggerWareHouseTransaction: true,
          product: productOptions.productId || productId,
          requestedProductFromWarehouse: [
            {
              productQuantity: 5,
              warehouse: warehouseId,
            },
          ],
          isJewelryInvoiceProduct: true,
          jewelryMakingCharges: 0,
        },
      ],
      ...overrides,
    };

    const res = await client.post("/invoices", payload);
    console.log("📦 Invoice created:", JSON.stringify(res.data.data, null, 2));
    return res;
  }

  test(
    "✅ should create invoice with only tax",
    async () => {
      try {
        const res = await createInvoice({ tax: 10 });
        expect([200, 201]).toContain(res.status);
        expect(res.data.data.invoiceProducts[0].tax).toBe(10);
      } catch (err) {
        logError(err);
      }
    },
    20000
  );

  test(
    "✅ should create invoice with only discount",
    async () => {
      try {
        const res = await createInvoice({ discountValue: 20, discountType: "percentage" });
        expect([200, 201]).toContain(res.status);
        expect(res.data.data.invoiceProducts[0].discountValue).toBe(20);
      } catch (err) {
        logError(err);
      }
    },
    20000
  );

  test(
    "✅ should create invoice with tax and discount",
    async () => {
      try {
        const res = await createInvoice({ tax: 5, discountValue: 10, discountType: "fix" });
        expect([200, 201]).toContain(res.status);
        expect(res.data.data.invoiceProducts[0].tax).toBe(5);
        expect(res.data.data.invoiceProducts[0].discountValue).toBe(10);
      } catch (err) {
        logError(err);
      }
    },
    20000
  );

  test(
    "✅ should create invoice without tax and discount",
    async () => {
      try {
        const res = await createInvoice({});
        expect([200, 201]).toContain(res.status);
        expect(res.data.data.invoiceProducts[0].tax).toBe(0);
        expect(res.data.data.invoiceProducts[0].discountValue).toBe(0);
      } catch (err) {
        logError(err);
      }
    },
    20000
  );

  test(
    "❌ should fail when product does not exist",
    async () => {
      try {
        await createInvoice({ productId: "invalid-product-id" });
      } catch (err) {
        console.log("🚨 Expected failure:", err.response?.data || err.message);
        expect(err.response.status).toBeGreaterThanOrEqual(400);
      }
    },
    20000
  );
});
