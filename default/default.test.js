// default.test.js
const { getToken } = require("../auth/auth.js");
const axios = require("axios");

const API_BASE = "https://cnt.liara.run";

let token;
let client;

function logError(err) {
  if (err.response) {

  } else {
  }
  throw err;
}

function randomString(prefix) {
  return `${prefix}-${Math.random().toString(36).substring(2, 8)}`;
}

describe("Default Notification API E2E", () => {
  beforeAll(async () => {
    token = await getToken();

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
          token, 
          message: randomString("msg"),
          title: randomString("title"),
        };

        const res = await client.post("/notification", payload);
        expect([200, 201]).toContain(res.status);
      } catch (err) {
        logError(err);
      }
    },
    30000
  );
});
