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

describe("Bank-Accounts API E2E", () => {
    let createdBank_AccountId;

    test('should  create a new bank Account ',
    async () => {
        try{
            const payload ={
                name:  `test-${Date.now()}`,
                currentBalance: 0,
                ownerName:  `test-${Date.now()}`,
                cardNumber: "71116222",
                bankName:  `test-${Date.now()}`,
                iBan: "string",
                description: "string",
                currency: "IRT"
              
    
            };
            const res = await client.post("/bank-accounts", payload);


            expect([200,201]).toContain(res.status);
            expect(res.data.data).toHaveProperty("_id");
            expect(res.data.data).toHaveProperty("name", payload.name);
            expect(res.data.data).toHaveProperty("ownerName", payload.ownerName);
            expect(res.data.data).toHaveProperty("bankName", payload.bankName);
            expect(res.data.data).toHaveProperty("cardNumber", payload.cardNumber);
            

            createdBank_AccountId = res.data.data._id;
        } catch(err){
            logError(err);
        }
     },20000
     );
});