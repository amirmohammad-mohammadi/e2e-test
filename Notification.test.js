// notifications.test.js
const { getToken } = require("./auth.js"); // 📌 always get fresh token
const axios = require("axios");

// Helpers
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
    // console.error("STATUS:", err.response.status);
    // console.error("BODY:", JSON.stringify(err.response.data, null, 2));
  } else {
    // console.error("ERROR:", err.message);
  }
  throw err;
}

describe("Notifications API E2E", () => {
  let client;
  let token;

  beforeAll(async () => {
    // 📌 Get fresh token from auth.test.js
    token = await getToken();
    console.log("✅ Token ready:", token);

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

        // console.log("📤 Sending Notification Payload:", payload);

        const res = await client.post("/notification", payload);

        // console.log("📩 Notification API Response:", res.data);

        expect([200, 201]).toContain(res.status);
        expect(res.data.data).toHaveProperty("message", "Sended");
      } catch (err) {
        logError(err);
      }
    },
    30000
  );
});
