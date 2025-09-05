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

describe("transactions API E2E", () => {
  let createdTransactionId;

  test("should create a new transaction", async () => {
    try {
      
      const accountRes = await client.get("/accounts");
      const accountId = accountRes.data.data[0]._id;

     
      const bankAccountRes = await client.get("/bank-accounts");
      const bankAccountId = bankAccountRes.data.data[0]._id;

     
      const payload = {
        amount: "100000", 
        paymentMethod: "cash", 
        transactionType: "sell", 
        status: "paid", 
        description: "Payment for black t-shirt",
        account: accountId, 
        bankAccount: bankAccountId,
        currency: "IRT",
      };
     
      const res = await client.post("/transactions", payload);

      
      expect([200, 201]).toContain(res.status);
      expect(res.data.data).toHaveProperty("_id");
      expect(res.data.data).toHaveProperty("description", payload.description);
      expect(res.data.data).toHaveProperty("amount", payload.amount);
      expect(res.data.data).toHaveProperty("paymentMethod", payload.paymentMethod);
      expect(res.data.data).toHaveProperty("transactionType", payload.transactionType);
      expect(res.data.data).toHaveProperty("status", payload.status);

      createdTransactionId = res.data.data._id;
    } catch (err) {
      logError(err);
    }
  }, 20000);
});
