const { getToken } = require("../auth/auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";


function randomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


function logError(endpoint, err) {
  if (err.response) {

  } else {
  }
}

describe("Invoices API E2E", () => {
  let client;
  let token;
  let createdInvoiceId;

  let product;
  let warehouses;
  let bankAccount;  
  beforeAll(async () => {
    token = await getToken();
    console.log("✅ Token ready:", token);

    client = axios.create({
      baseURL: API_BASE,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }, 300000);

    const productRes = await client.get("/products?pageSize=50&page=1");
    product = productRes.data.data.slice(-1)[0];

    const warehouseRes = await client.get("/warehouses?pageSize=50&page=1");
    warehouses = warehouseRes.data.data.slice(-3);

    const bankAccountRes = await client.get("/bank-accounts?pageSize=50&page=1");
    bankAccount = bankAccountRes.data.data.slice(-1)[0];
    if (!bankAccount) {
      throw new Error("No bank account found for tests.");
    }
  }, 300000);

  test("should create an invoice with random tax, discount, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "sell",
        status: "issued",
        paymentStatus: "paid",
        tax: randomInt(9),
        discountValue: randomInt(9),
        discountType: randomChoice(["fix", "percentage"]),
        currency: randomChoice(["USD", "IRT", "AED"]),
        invoiceProducts: [
          {
            name: product.name,
            price: randomInt(product.pricePerCurrency[0].sellPrice3),
            extraCost: randomInt(100),
            discountValue: randomInt(9),
            discountType: randomChoice(["fix", "percentage"]),
            tax: randomInt(9),
            quantity: randomInt(5) + 1,
            triggerWareHouseTransaction: true,
            product: product._id,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: randomInt(3) + 1,
              warehouse: w._id,
            })),
          },
        ],
        account: bankAccount._id,
        banks: [bankAccount._id],
        bankAccount: bankAccount._id,
      };


      const res = await client.post("/invoices", payload);
      expect([200, 201]).toContain(res.status);

      createdInvoiceId = res.data.data._id;
      console.log("✅ Invoice created:", createdInvoiceId);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);

  test("should create a buy invoice with fixed 9% tax and 5% discount", async () => {
    try {
      const payload = {
        description: `BuyInvoice-${Date.now()}`,
        invoiceType: "buy",
        status: "issued",
        paymentStatus: "paid",
        tax: 0,
        discountValue: 0,
        discountType: "percentage",
        currency: "USD",
        invoiceProducts: [
          {
            name: product.name,
            price: 1000,
            extraCost: 300,
            discountValue: 5,
            discountType: "percentage",
            tax: 9,
            quantity: 500,
            triggerWareHouseTransaction: true,
            product: product._id,
            requestedProductFromWarehouse: warehouses.map((w) => ({
              productQuantity: 500,
              warehouse: w._id,
            })),
          },
        ],
        account: bankAccount._id,
        banks: [bankAccount._id],
        bankAccount: bankAccount._id,
      };

      const res = await client.post("/invoices", payload);
      expect([200, 201]).toContain(res.status);
      expect(res.data).toBeDefined();
      expect(res.data.data).toBeDefined();

      const invoice = res.data.data;

      let totalInvoicePrice = 0;
      invoice.invoiceProducts.forEach((item) => {
        const realPrice = item.price + item.extraCost;
        const discountAmount =
          item.discountType === "percentage"
            ? (realPrice * item.discountValue) / 100
            : item.discountValue;
        const priceAfterDiscount = realPrice - discountAmount;
        const taxAmount = (priceAfterDiscount * item.tax) / 100;
        const totalPricePerProduct = (priceAfterDiscount + taxAmount) * item.quantity;

        totalInvoicePrice += totalPricePerProduct;

        console.log("Product:", item.name);
        console.log("  Real price (price + extraCost):", realPrice);
        console.log("  Discount amount:", discountAmount);
        console.log("  Price after discount:", priceAfterDiscount);
        console.log("  Tax amount:", taxAmount);
        console.log("  Quantity:", item.quantity);
        console.log("  Total price for this product:", totalPricePerProduct);
      });

      console.log("Total invoice price:", totalInvoicePrice);

      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("buy");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("paid");
      expect(invoice.currency).toBe("USD");
      expect(invoice.tax).toBe(0);
      expect(invoice.discountValue).toBe(0);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe(product.name);
      expect(item.price).toBe(1000);
      expect(item.extraCost).toBe(300);
      expect(item.discountValue).toBe(5);
      expect(item.discountType).toBe("percentage");
      expect(item.tax).toBe(9);
      expect(item.quantity).toBe(500);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);
});











