const { getToken } = require("../auth/auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let client;


function logError(err) {
  if (err.response) {
  } else {
  }
  throw err;
}


async function createWarehouse(client) {
  try {
    const payload = {
      name: `auto-warehouse-${Date.now()}`,
      location: "tehran",
      capacity: 10000,
      manager: "auto-manager",
    };

    const res = await client.post("/warehouses", payload);
    expect([200, 201]).toContain(res.status);

    const warehouse = res.data.data;
    return warehouse._id;
  } catch (err) {
    logError(err);
  }
}


describe("Warehouse API E2E", () => {
  beforeAll(async () => {
    const token = await getToken();

    client = axios.create({
      baseURL: API_BASE,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  });

  test(
    "should create a warehouse",
    async () => {
      const warehouseId = await createWarehouse(client);
      expect(warehouseId).toBeDefined();
    },
    30000 
  );
});
