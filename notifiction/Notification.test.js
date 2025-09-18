const { getToken } = require("../auth/auth.js");
const axios = require("axios");


function randomPhone() {
  return "09" + Math.floor(100000000 + Math.random() * 900000000);
}

function randomMessage() {
  const messages = [
    "Ping ✅",
    "Hello from test 🚀",
    "Random notification 🔔",
    "System check 🛠️",
    "Invoice reminder 💰"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function logError(err) {
  if (err.response) {

  } else {
 
  }
  throw err;
}

describe("Notifications API E2E", () => {
  let client;
  let token;

  beforeAll(async () => {
    token = await getToken();

    client = axios.create({
      baseURL: "https://cnt.liara.run",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  });

  test(
    "✅ should send a random message to a random number",
    async () => {
      try {
        const payload = { message: randomMessage(), mobile: randomPhone() };


        const res = await client.post("/notification", payload);


        expect([200, 201]).toContain(res.status);
        expect(res.data.data).toHaveProperty("message", "Sended");
      } catch (err) {
        logError(err);
      }
    },
    30000
  );
});
