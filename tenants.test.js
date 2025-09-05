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

describe("tenantsactions API E2E", () => {
  let createdTenantsId;

  test("should create a new tenants", async () => {
    try {
     
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
        signatureFile :"string",
        signatureDataFile: "string",
        logoFile: "string",
        logoDataFile: "string",
        stampFile: "string",
        stampDataFile: "string"      
      };
     
      const res = await client.post("/tenants", payload);

      
      expect([200, 201]).toContain(res.status);
      expect(res.data.data).toHaveProperty("_id");
      expect(res.data.data).toHaveProperty("name", payload.name);
      expect(res.data.data).toHaveProperty("email", payload.email);
      expect(res.data.data).toHaveProperty("website", payload.website);
      expect(res.data.data).toHaveProperty("address", payload.address);
      
      createdTenantsId = res.data.data._id;
    } catch (err) {
      logError(err);
    }
  }, 20000);
});
