// ---- CONFIG ----
const SEED = 1337;
const BASE64_JSON = "$$PLACEHOLDER$$";

// ---- helpers ----
function seededId(str, seed) {
  let hash = 2166136261 ^ seed;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

// ---- decode base64 json ----
const jsonText = atob(BASE64_JSON);
const charCount = jsonText.length;
const base64 = BASE64_JSON.length;

let parsed;
try {
  parsed = JSON.parse(jsonText);
} catch (e) {
  console.log("JSON parse failed");
  parsed = {};
}

// ---- extract matches ----
const resultsall = Array.isArray(parsed.matches) ? parsed.matches : [];
let issueCount = 0;

// ---- build filtered results ----
const filteredResults = resultsall.map(m => {
  if (!m || typeof m.Id !== "string" || !m.Id.length) {
    issueCount++;
    return null;
  }

  return {
    hsid: m.Id,
    id: seededId(m.Id, SEED)
  };
}).filter(Boolean);

// ---- light logging ----
console.log("matches:", resultsall.length);
console.log("filtered:", filteredResults.length);
console.log("issues:", issueCount);

// ---- final output ----
const output = {
  results: filteredResults,
  resultsall: resultsall,
  txt: {
    lng: charCount,
    b64: base64,
    issuec: issueCount
  }
};
output
