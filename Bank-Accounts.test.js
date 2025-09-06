const axios = require("axios");


const API_BASE = "https://cnt.liara.run";
const fs = require("fs");
const TOKEN_FILE = "token.json";

function loadToken() {
  if (fs.existsSync(TOKEN_FILE)) {
    const data = fs.readFileSync(TOKEN_FILE);
    return JSON.parse(data).token;
  }
  throw new Error("❌ No token found! Run auth.test.js first to generate token.");
}


const AUTH_TOKEN = `Bearer ${loadToken()}`;
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