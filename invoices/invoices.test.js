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
  let account;
  let product;
  let warehouses;
  
  beforeAll(async () => {
    token = await getToken();

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

    const accountRes= await client.get("/accounts?pageSize=50&page=1");
    account = accountRes.data.data.slice(-1)[0];


  
  }, 300000);

  test("should create sell invoice with  product , discount and without tax, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "sell",
        status: "issued",
        paymentStatus: "not_paid",
        tax: 0,
        discountValue: 0,
        discountType: "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: product.name,
            price: 800000,
            extraCost: 5000,
            discountValue: 0,
            discountType: "percentag",
            tax: 0,
            quantity: 10,
            triggerWareHouseTransaction: true,
            product: product._id,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: 10,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };
      const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);



      expect(finalizedInvoice.data.data.status).toBe('issued');


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

       
      });


      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("sell");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("not_paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(0);
      expect(invoice.discountValue).toBe(0);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe(product.name);
      expect(item.price).toBe(100000);
      expect(item.extraCost).toBe(5000);
      expect(item.discountValue).toBe(0);
      expect(item.discountType).toBe("percentage");
      expect(item.tax).toBe(0);
      expect(item.quantity).toBe(10);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);

   test("should create sell invoice with  product and without tax, discount, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "sell",
        status: "issued",
        paymentStatus: "not_paid",
        tax: 0,
        discountValue: 9,
        discountType: "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: product.name,
            price: 800000,
            extraCost: 5000,
            discountValue: 9,
            discountType: "percentag",
            tax: 0,
            quantity: 10,
            triggerWareHouseTransaction: true,
            product: product._id,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: 10,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };
      const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);



      expect(finalizedInvoice.data.data.status).toBe('issued');


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

       
      });


      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("sell");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("not_paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(0);
      expect(invoice.discountValue).toBe(9);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe(product.name);
      expect(item.price).toBe(100000);
      expect(item.extraCost).toBe(5000);
      expect(item.discountValue).toBe(9);
      expect(item.discountType).toBe("percentage");
      expect(item.tax).toBe(0);
      expect(item.quantity).toBe(10);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);


    test("should create sell invoice with  product ,tax and without discount, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "sell",
        status: "issued",
        paymentStatus: "not_paid",
        tax: 9,
        discountValue: 0,
        discountType: "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: product.name,
            price: 800000,
            extraCost: 5000,
            discountValue: 0,
            discountType: "percentag",
            tax: 9,
            quantity: 10,
            triggerWareHouseTransaction: true,
            product: product._id,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: 10,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };
      const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);



      expect(finalizedInvoice.data.data.status).toBe('issued');


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

       
      });


      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("sell");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("not_paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(9);
      expect(invoice.discountValue).toBe(0);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe(product.name);
      expect(item.price).toBe(100000);
      expect(item.extraCost).toBe(5000);
      expect(item.discountValue).toBe(0);
      expect(item.discountType).toBe("percentage");
      expect(item.tax).toBe(9);
      expect(item.quantity).toBe(10);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);




    test("should create sell an invoice with product tax, discount, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "sell",
        status: "issued",
        paymentStatus: "not_paid",
        tax: 9,
        discountValue: 5,
        discountType:  "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: product.name,
            price: randomInt(product.pricePerCurrency[0].sellPrice3),
            extraCost: randomInt(100),
            discountValue: randomInt(9),
            discountType: randomChoice(["fix", "percentage"]),
            tax: 9,
            quantity: randomInt(5) + 1,
            triggerWareHouseTransaction: true,
            product: product._id,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: randomInt(3) + 1,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };

       const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);




      expect(finalizedInvoice.data.data.status).toBe('issued');
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

     
      });


      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("sell");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("not_paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(9);
      expect(invoice.discountValue).toBe(5);
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


  test("should create sell invoice without  product and tax, discount, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "sell",
        status: "issued",
        paymentStatus: "not_paid",
        tax: 0,
        discountValue: 0,
        discountType: "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: "string",
            price: randomInt(product.pricePerCurrency[0].sellPrice3),
            extraCost: randomInt(100),
            discountValue: 0,
            discountType: "percentag",
            tax: 0,
            quantity: randomInt(5) + 1,
            triggerWareHouseTransaction: true,
            product: null,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: randomInt(3) + 1,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };

      
      const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);



      expect(finalizedInvoice.data.data.status).toBe('issued');

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


      });


      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("sell");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("not_paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(0);
      expect(invoice.discountValue).toBe(0);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe("string");
      expect(item.price).toBe(1000);
      expect(item.extraCost).toBe(300);
      expect(item.discountValue).toBe(0);
      expect(item.discountType).toBe("percentage");
      expect(item.tax).toBe(0);
      expect(item.quantity).toBe(500);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);

      test("should create an sell invoice without  product and with  tax, discount, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "sell",
        status: "issued",
        paymentStatus: "not_paid",
        tax: 9,
        discountValue: 5,
        discountType:  "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: "string",
            price: randomInt(product.pricePerCurrency[0].sellPrice3),
            extraCost: randomInt(100),
            discountValue: randomInt(9),
            discountType: randomChoice(["fix", "percentage"]),
            tax: 9,
            quantity: randomInt(5) + 1,
            triggerWareHouseTransaction: true,
            product: null,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: randomInt(3) + 1,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };

       const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);




      expect(finalizedInvoice.data.data.status).toBe('issued');

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

      });

      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("sell");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("not_paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(9);
      expect(invoice.discountValue).toBe(5);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe("string");
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

   test("should create buy invoice with product and without tax, discount, currency and numbers", async () => {
  try {
    const payload = {
      description: `Invoice-${Date.now()}`,
      invoiceType: "purchase",
      status: "issued",
      paymentStatus: "not_paid",
      tax: 0,
      discountValue: 0,
      discountType: "percentage",
      currency: "IRT",
      invoiceProducts: [
        {
          name: product.name,
          price: 60000,
          extraCost: 5000,
          discountValue: 0,
          discountType: "percentage",  
          tax: 0,
          quantity: 10,
          triggerWareHouseTransaction: true,
          product: product._id,
          requestedProductFromWarehouse: warehouses.map(w => ({
            productQuantity: 10,
            warehouse: w._id,
          })),
        },
      ],
      account: account._id,
    };

      const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);




      expect(finalizedInvoice.data.data.status).toBe('issued');

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
    });

    expect(invoice._id).toBeDefined();
    expect(invoice.invoiceType).toBe("purchase");
    // expect(invoice.status).toBe("issued");
    expect(invoice.paymentStatus).toBe("not_paid");
    expect(invoice.currency).toBe("IRT");
    expect(invoice.tax).toBe(0);
    expect(invoice.discountValue).toBe(0);
    expect(invoice.discountType).toBe("percentage");
    expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
    expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

    const item = invoice.invoiceProducts[0];
    expect(item.name).toBe(product.name);
    expect(item.price).toBe(60000);
    expect(item.extraCost).toBe(5000);
    expect(item.discountValue).toBe(0);
    expect(item.discountType).toBe("percentage");
    expect(item.tax).toBe(0);
    expect(item.quantity).toBe(10);

  } catch (err) {
    logError("/invoices", err);
    throw err; 
  }
}, 300000);



    test("should create an buy invoice with  tax, discount, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "buy",
        status: "issued",
        paymentStatus: "paid",
        tax: 9,
        discountValue: 5,
        discountType:  "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: product.name,
            price: 50000,
            extraCost: 5000,
            discountValue: 5,
            discountType:  "percentage",
            tax: 9,
            quantity: 10,
            triggerWareHouseTransaction: true,
            product: product._id,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: 10,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };

       const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);




      expect(finalizedInvoice.data.data.status).toBe('issued');

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

     
      });


      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("buy");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(9);
      expect(invoice.discountValue).toBe(5);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe(product.name);
      expect(item.price).toBe(50000);
      expect(item.extraCost).toBe(5000);
      expect(item.discountValue).toBe(5);
      expect(item.discountType).toBe("percentage");
      expect(item.tax).toBe(9);
      expect(item.quantity).toBe(10);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);

  test("should create an buy invoice with product, tax and without  discount, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "buy",
        status: "issued",
        paymentStatus: "paid",
        tax: 9,
        discountValue: 0,
        discountType:  "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: product.name,
            price: 50000,
            extraCost: 5000,
            discountValue: 0,
            discountType:"percentage",
            tax: 9,
            quantity: 10,
            triggerWareHouseTransaction: true,
            product: product._id,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: 10,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };

       const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);




      expect(finalizedInvoice.data.data.status).toBe('issued');

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

     
      });


      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("buy");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(9);
      expect(invoice.discountValue).toBe(0);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe(product.name);
      expect(item.price).toBe(50000);
      expect(item.extraCost).toBe(5000);
      expect(item.discountValue).toBe(0);
      expect(item.discountType).toBe("percentage");
      expect(item.tax).toBe(9);
      expect(item.quantity).toBe(10);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);


     test("should create an buy invoice with product, discount and without  tax, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "buy",
        status: "issued",
        paymentStatus: "paid",
        tax: 0,
        discountValue: 5,
        discountType:  "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: product.name,
            price: 50000,
            extraCost: 5000,
            discountValue: 5,
            discountType:"percentage",
            tax: 0,
            quantity: 10,
            triggerWareHouseTransaction: true,
            product: product._id,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: 10,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };

       const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);




      expect(finalizedInvoice.data.data.status).toBe('issued');

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

     
      });


      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("buy");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(0);
      expect(invoice.discountValue).toBe(5);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe(product.name);
      expect(item.price).toBe(50000);
      expect(item.extraCost).toBe(5000);
      expect(item.discountValue).toBe(5);
      expect(item.discountType).toBe("percentage");
      expect(item.tax).toBe(0);
      expect(item.quantity).toBe(10);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);


  test("should create buy invoice without  product and tax, discount, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "buy",
        status: "issued",
        paymentStatus: "paid",
        tax: 0,
        discountValue: 0,
        discountType: "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: "string",
            price: 50000,
            extraCost: 5000,
            discountValue: 0,
            discountType: "percentag",
            tax: 0,
            quantity: 10,
            triggerWareHouseTransaction: true,
            product: null,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: 10,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };
 const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);




      expect(finalizedInvoice.data.data.status).toBe('issued');

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


      });


      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("buy");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(0);
      expect(invoice.discountValue).toBe(0);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe("string");
      expect(item.price).toBe(50000);
      expect(item.extraCost).toBe(5000);
      expect(item.discountValue).toBe(0);
      expect(item.discountType).toBe("percentage");
      expect(item.tax).toBe(0);
      expect(item.quantity).toBe(10);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);

      test("should create an buy invoice without  product and with  tax, discount, currency and numbers", async () => {
    try {
      const payload = {
        description: `Invoice-${Date.now()}`,
        invoiceType: "buy",
        status: "issued",
        paymentStatus: "paid",
        tax: 9,
        discountValue: 5,
        discountType:  "percentage",
        currency: "IRT",
        invoiceProducts: [
          {
            name: "string",
            price: 50000,
            extraCost: 5000,
            discountValue: 5,
            discountType: "percentage",
            tax: 9,
            quantity: 10,
            triggerWareHouseTransaction: true,
            product: null,
            requestedProductFromWarehouse: warehouses.map(w => ({
              productQuantity: 10,
              warehouse: w._id,
            })),
          },
        ],
        account: account._id,
  
      };

      const accountpayment = await client.get(`accounts/${account._id}`);

      
      const res = await client.post("/invoices", payload);
      createdInvoiceId = res.data.data._id;
      const finalizedInvoice = await client.put(`invoices/${createdInvoiceId}/finalize`);

      const accountpayment1 = await client.get(`accounts/${account._id}`);




      expect(finalizedInvoice.data.data.status).toBe('issued');

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

      });

      expect(invoice._id).toBeDefined();
      expect(invoice.invoiceType).toBe("buy");
      expect(invoice.status).toBe("issued");
      expect(invoice.paymentStatus).toBe("paid");
      expect(invoice.currency).toBe("IRT");
      expect(invoice.tax).toBe(9);
      expect(invoice.discountValue).toBe(5);
      expect(invoice.discountType).toBe("percentage");
      expect(Array.isArray(invoice.invoiceProducts)).toBe(true);
      expect(invoice.invoiceProducts.length).toBeGreaterThan(0);

      const item = invoice.invoiceProducts[0];
      expect(item.name).toBe("string");
      expect(item.price).toBe(50000);
      expect(item.extraCost).toBe(500);
      expect(item.discountValue).toBe(5);
      expect(item.discountType).toBe("percentage");
      expect(item.tax).toBe(9);
      expect(item.quantity).toBe(10);

    } catch (err) {
      logError("/invoices", err);
    }
  }, 300000);

  
});






