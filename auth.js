// auth.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://cnt.liara.run";
const TOKEN_FILE = path.join(__dirname, "token.json");
const SESSION_FILE = path.join(__dirname, "session.json");


const INITIAL_AUTH_BEARER = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// ------------------ Helpers ------------------
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function loadJSON(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

// ------------------ Session ------------------
function saveSession(sessionId, otp) {
  saveJSON(SESSION_FILE, { sessionId, otp });
  console.log("✅ Session saved in", SESSION_FILE);
}

function loadSession() {
  return loadJSON(SESSION_FILE);
}

// ------------------ Token ------------------
function saveToken(token) {
  saveJSON(TOKEN_FILE, { token });
  console.log("✅ Token saved in", TOKEN_FILE);
}

function loadToken() {
  const data = loadJSON(TOKEN_FILE);
  return data?.token || null;
}

// ------------------ Request token with existing session ------------------
async function requestTokenWithSavedSession() {
  const sessionData = loadSession();
  if (!sessionData) throw new Error("❌ No session saved. Run setupSession() first.");

  const { sessionId, otp } = sessionData;

  try {
    const res = await axios.get(`${API_BASE}/auth/validate-otp/${sessionId}/${otp}`, {
      headers: { Authorization: `Bearer ${INITIAL_AUTH_BEARER}` },
    });

    const token = res.data.data.token;
    saveToken(token);
    return token;
  } catch (err) {
    console.warn("⚠️ Failed to get token with saved session:", err.response?.data || err.message);
    return null; 
  }
}

// ------------------ Create new session and token ------------------
async function createNewSessionAndToken() {
  const payload = {
    name: `test-user-${Date.now()}`,
    email: `user${Date.now()}@mail.com`,
    password: "password123",
    phone: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
  };

  const signupRes = await axios.post(`${API_BASE}/auth/sign-up`, payload, {
    headers: { Authorization: `Bearer ${INITIAL_AUTH_BEARER}` },
  });

  const { sessionId, otp } = signupRes.data.data;
  saveSession(sessionId, otp);


  const res = await axios.get(`${API_BASE}/auth/validate-otp/${sessionId}/${otp}`, {
    headers: { Authorization: `Bearer ${INITIAL_AUTH_BEARER}` },
  });

  const token = res.data.data.token;
  saveToken(token);
  return token;
}

// ------------------ Main function for tests ------------------
async function getToken() {
  let token = loadToken();
  if (token) return token;

  let session = loadSession();
  if (session) {
    token = await requestTokenWithSavedSession();
    if (token) return token;

    console.log("⚠️ Existing session invalid, creating new session...");
  }

  // session جدید بساز و توکن بگیر
  return await createNewSessionAndToken();
}

module.exports = { getToken, createNewSessionAndToken, requestTokenWithSavedSession, setupSession: createNewSessionAndToken };
