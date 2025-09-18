// units.test.js (real E2E)
const axios = require("axios");
const { getToken } = require("../auth/auth.js");

console.log(getToken()); 

const API_BASE = "https://cnt.liara.run";

let client;
let createdUnitId;


beforeAll(async () => {

  const token = await getToken();


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


describe("Units API E2E", () => {
  test("🆕 should create a unit", async () => {
    const payload = {
      name: "unit-" + Date.now(),
      parent: null,
      ratioToParent: 0,
      isInteger: true,
    };

    try {
      const res = await client.post("/units", payload);
      expect([200, 201]).toContain(res.status);
      expect(res.data.data).toHaveProperty("_id");
      createdUnitId = res.data.data._id;
    } catch (err) {
      logError("/units", err);
    }
  });

  test("📋 should list units", async () => {
    try {
      const res = await client.get("/units");
      expect([200, 201]).toContain(res.status);
      expect(Array.isArray(res.data.data)).toBe(true);
    } catch (err) {
      logError("/units", err);
    }
  });

  test("✏️ should update the created unit", async () => {
    if (!createdUnitId) return;
    const updatePayload = { name: "updated-" + Date.now() };
    try {
      const res = await client.put(`/units/${createdUnitId}`, updatePayload);
      expect([200, 201]).toContain(res.status);
      expect(res.data.data).toHaveProperty("acknowledged", true);
    } catch (err) {
      logError(`/units/${createdUnitId}`, err);
    }
  });

  test("🗑️ should delete the created unit", async () => {
    if (!createdUnitId) return;
    try {
      const res = await client.delete(`/units/${createdUnitId}`);
      expect([200, 202]).toContain(res.status);
      expect(res.data.data).toHaveProperty("acknowledged", true);
    } catch (err) {
      logError(`/units/${createdUnitId}`, err);
    }
  });
});
