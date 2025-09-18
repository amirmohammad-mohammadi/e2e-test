
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://cnt.liara.run";
const TOKEN_FILE = path.join(__dirname, "token.json");
const SESSION_FILE = path.join(__dirname, "session.json");

const INITIAL_AUTH_BEARER = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function loadJSON(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function saveSession(sessionId, otp) {
  saveJSON(SESSION_FILE, { sessionId, otp });
}

function loadSession() {
  return loadJSON(SESSION_FILE);
}

function saveToken(token) {
  saveJSON(TOKEN_FILE, { token });
}

function loadToken() {
  const data = loadJSON(TOKEN_FILE);
  return data?.token || null;
}

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
    return null; 
  }
}

async function createNewSessionAndToken() {
  const payload = {
    name: `amir`,
    email: `amirmohammadi432@gmail.com`,
    password: "password123",
    phone: `09173886449`,
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

async function getToken() {
  let token = loadToken();
  if (token) return token;

  let session = loadSession();
  if (session) {
    token = await requestTokenWithSavedSession();
    if (token) return token;
  }

  return await createNewSessionAndToken();
}

module.exports = { getToken, createNewSessionAndToken, requestTokenWithSavedSession, setupSession: createNewSessionAndToken };


