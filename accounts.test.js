const axios = require("axios");


const API_BASE = "https://cnt.liara.run";
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjZkNWM3ODQ0MDhjNmJmNTYyOThiMiIsImRhdGUiOiIyMDI1LTA5LTA1VDA2OjEyOjUzLjU0M1oiLCJpYXQiOjE3NTcwNTI3NzN9.dmQv28TFU2UE-RoyfHFc0vcE6WHWYi_oqe1Ib8_O8pc";

  const client = axios.create({
      baseURL : API_BASE,
      headers: {
          Accept:"application/json",
          Authorization: AUTH_TOKEN,
          "content-Type": "application/json"
      },
  });

function logError(err){
    if(err.response){
        console.error("STATUS:",err.response.statuse);
        console.error("BODY:",JSON.stringify(err.response.data,null, 2));
    } else {
        console.error("ERROR",err.massage);
    } throw err;
};

describe("Product Accounts API E2E", () => {
    let createdAccountsId;

    test('should create a new accounts',
    async () =>  {
        try {
            const payload = {
                name:  `test-${Date.now()}`,
                phone: "099999999999",
                phone2: "09879579879",
                whatsapp:  `test-${Date.now()}`,
                brandName:  `test-${Date.now()}`,
                province: "68b6bf0984408c6bf562988e",
                city: "68b6bf0984408c6bf562988d",
                address:  `test-${Date.now()}`
            };
            const res = await client.post("/accounts", payload);
                             
            expect([200,201]).toContain(res.status);
            expect(res.data.data).toHaveProperty("_id");
            expect(res.data.data).toHaveProperty("name", payload.name);
            createdAccountsId = res.data.data._id;
        } catch (err) {
            logError(err);
        }
     },20000
     );
});








