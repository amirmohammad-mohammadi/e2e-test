const fs = require("fs");
const path = require("path");
const { post, get } = require("axios");

const API_BASE = "https://cnt.liara.run";
const TOKEN_FILE = path.join(__dirname, "token.json");

// Save token to file
function saveToken(token) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token }, null, 2));
}

// Load token from file
function loadToken() {
  if (fs.existsSync(TOKEN_FILE)) {
    const data = fs.readFileSync(TOKEN_FILE);
    return JSON.parse(data).token;
  }
  return null;
}

function randomName() {
  return `user-${Math.floor(Math.random() * 1000000)}`;
}

function randomPhone() {
  return "0912" + Math.floor(1000000 + Math.random() * 9000000);
}

describe("Auth API", () => {
  test("should get token or use saved token", async () => {
    let token = loadToken();

    if (!token) {
      console.log("⏳ No token found → starting new sign-up...");

      // Step 1: sign-up
      const name = randomName();
      const phone = randomPhone();

      console.log("📌 Sending signUp request with:", { name, phone });

      const signupRes = await post(`${API_BASE}/auth/sign-up`, { name, phone });
      expect([200, 201]).toContain(signupRes.status);

      const { sessionId, otp } = signupRes.data.data;
      console.log("✅ signUp response:", { sessionId, otp });

      // Step 2: validate-otp (GET with params in URL)
      console.log("📌 Sending validate-otp...");
      const validateRes = await get(
        `${API_BASE}/auth/validate-otp/${sessionId}/${otp}`
      );

      expect([200, 201]).toContain(validateRes.status);
      token = validateRes.data.data.token;

      console.log("🎉 Token received:", token);

      // Save token into token.json
      saveToken(token);
    } else {
      console.log("✅ Using existing token from file:", token);
    }

    // Ensure token exists
    expect(token).toBeDefined();
  }, 20000);
});
