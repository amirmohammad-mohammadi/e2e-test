// default.test.js
const { getToken } = require("./auth.js"); // 📌 always get fresh token
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let token;
let client;

function logError(err) {
  if (err.response) {
    // console.error("STATUS:", err.response.status);
    // console.error("BODY:", JSON.stringify(err.response.data, null, 2));
  } else {
    console.error("ERROR:", err.message);
  }
  throw err;
}

function randomString(prefix) {
  return `${prefix}-${Math.random().toString(36).substring(2, 8)}`;
}

describe("Default Notification API E2E", () => {
  // 📌 Get fresh token and create Axios client before all tests
  beforeAll(async () => {
    token = await getToken();
    console.log("✅ Token ready:", token);

    client = axios.create({
      baseURL: API_BASE,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  });

  test(
    "📤 should send a notification",
    async () => {
      try {
        const payload = {
          token, // use fresh token
          message: randomString("msg"),
          title: randomString("title"),
        };

        const res = await client.post("/notification", payload);
        expect([200, 201]).toContain(res.status);
        // console.log("✅ Notification sent successfully");
      } catch (err) {
        logError(err);
      }
    },
    30000
  );
});
