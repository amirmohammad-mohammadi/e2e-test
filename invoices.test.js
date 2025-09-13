// invoices.test.js
const { getToken } = require("./auth.js"); // 📌 always get fresh token
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://cnt.liara.run";
const PRODUCT_FILE = "product.json";
const WAREHOUSE_FILE = "warehouses.json";
const BANK_ACCOUNTS_FILE = "bankAccounts.json";
const TAGS_FILE = "tags.json";
const INVOICES_FILE = "invoices.json"; // store created invoices

// ------------------ Helpers ------------------
function loadJSON(file) {
  if (!fs.existsSync(file)) throw new Error(`❌ ${file} not found!`);
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  return Array.isArray(data) ? data : [data];
}

function saveJSONAppend(file, item) {
  let data = [];
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, "utf-8"));
    if (!Array.isArray(data)) data = [];
  }
  data.push(item);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`✅ Saved to ${file}: ${item._id}`);
}

function randomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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
describe("Invoices API E2E", () => {
  let client;
  let token;
  let createdInvoiceId;

  let product;
  let warehouses;
  let bankAccount;
  let tag;

  beforeAll(async () => {
    // 📌 Get fresh token
    token = await getToken();
    console.log("✅ Token ready:", token);

    client = axios.create({
      baseURL: API_BASE,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Load latest data
    product = loadJSON(PRODUCT_FILE).slice(-1)[0];
    warehouses = loadJSON(WAREHOUSE_FILE).slice(-3);
    bankAccount = loadJSON(BANK_ACCOUNTS_FILE).slice(-1)[0];
    tag = loadJSON(TAGS_FILE).slice(-1)[0];
  });

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
            isJewelryInvoiceProduct: product.isJewelry,
            jewelryMakingCharges: randomInt(product.pricePerCurrency[0].jewelryMakingCharges || 0),
          },
        ],
        account: bankAccount._id,
        banks: [bankAccount._id],
        bankAccount: bankAccount._id,
        tags: [tag._id],
        paymentItems: [
          {
            paymentType: "bank_transfer",
            dateTime: new Date().toISOString(),
            amount: randomInt(500) + 50,
            description: "Payment for invoice",
            bankName: "Test Bank",
            checkNumber: String(randomInt(999999)),
            payee: "Customer Name",
            status: "pending",
          },
        ],
      };

      console.log("📤 Sending invoice payload:", JSON.stringify(payload, null, 2));

      const res = await client.post("/invoices", payload);
      expect([200, 201]).toContain(res.status);

      createdInvoiceId = res.data.data._id;
      console.log("✅ Invoice created:", createdInvoiceId);

      // Append to local invoices.json
      const savedInvoice = {
        ...res.data.data,
        creator: res.data.data.creator || res.data.data.createdBy || {},
      };
      saveJSONAppend(INVOICES_FILE, savedInvoice);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 30000);
});
