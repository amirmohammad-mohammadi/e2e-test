const { getToken } = require("../auth/auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let token;
let client;


beforeAll(async () => {

  token = await getToken();


  client = axios.create({
    baseURL: API_BASE,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
});

function logError(endpoint, err) {
  if (err.response) {

  } else {
  
  }
  throw err;
}


describe("Tenants API E2E", () => {
  let createdTenantId;

  test(
    "🆕 should create a new tenant",
    async () => {
      const payload = {
        name: `test-${Date.now()}`,
        email: `user${Date.now()}@gmail.com`,
        phone: "09876543212",
        landLine: `test-${Date.now()}`,
        headLine: `test-${Date.now()}`,
        instagram: `test-${Date.now()}`,
        address: "tehran",
        website: `https://www.site${Date.now()}.com`,
        isActive: true,
        invoiceSettings: {
          stamp: true,
          profileName: true,
          accountName: true,
          profilePhoneNumber: true,
          accountPhoneNumber: true,
          accountAddress: true,
          invoiceType: true,
          date: true,
          invoiceCode: true,
          name: true,
          phone: true,
          address: true,
          headerColor: "string",
          profileAddress: true,
          discount: true,
          description: true,
          invoiceTemplate: "string"
        },
        accountSettings: {
          transferBtn: true,
          convertBtn: true
        },
        avatar: "string",
        signatureFile: "string",
        signatureDataFile: "string",
        logoFile: "string",
        logoDataFile: "string",
        stampFile: "string",
        stampDataFile: "string"
      };

      try {
        const res = await client.post("/tenants", payload);

        expect([200, 201]).toContain(res.status);
        expect(res.data.data).toHaveProperty("_id");
        expect(res.data.data).toHaveProperty("name", payload.name);
        expect(res.data.data).toHaveProperty("email", payload.email);
        expect(res.data.data).toHaveProperty("website", payload.website);
        expect(res.data.data).toHaveProperty("address", payload.address);

        createdTenantId = res.data.data._id;
      } catch (err) {
        logError("/tenants", err);
      }
    },
    30000 
  );
});
