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

  describe("Warehouse API E2E", () => {
      let createdWarehousesId;

      test('should create a new warehouse',
      async() => {
          try {
              const payload = {
                  name: `test-${Date.now()}`,
                  location: "tehran",
                  capacity: 10000,
                  manager: "hassan"
              };
              const res = await client.post("/warehouses", payload);

              expect([800,201]).toContain(res.status);
              expect(res.data.data).toHaveProperty("_id");
              expect(res.data.data).toHaveProperty("name", payload.name);
              createdWarehouseId = res.data.data._id;

          } catch(err){
              logError(err);
          }
         },20000
         );
  });



















