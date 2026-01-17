/* ============================================================
   MAPGEN MATCH PARSER (SYNC, XANO-SAFE)
   ============================================================ */

/* =========================
   INPUT (Base64)
   ========================= */

var base64 = $$PLACEHOLDER$$;

/* Decode Base64 → JSON */
var jsonStr = atob(base64);
var input = JSON.parse(jsonStr);

var matches = input && input.matches ? input.matches : [];

/* =========================
   CONSTANTS
   ========================= */

var CORE_PARENT_ID = "core";
var ICON_URL = "https://example.com/icons/match.png";

var BASE_Y = 0;
var Y_SCALE = 6;        // seconds → distance
var ORBIT_SCALE = 0.04;

var NOW = Date.now();

/* =========================
   HELPERS
   ========================= */

/* Fast deterministic hash (32-bit) */
function hash32(str) {
  var h = 2166136261;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

/* MatchId → SLUG (AAA-1234) */
function makeSlug(matchId) {
  var h = hash32(matchId);

  var letters = "";
  for (var i = 0; i < 3; i++) {
    letters += String.fromCharCode(65 + (h % 26));
    h = Math.floor(h / 26);
  }

  var numbers = (h % 10000).toString();
  while (numbers.length < 4) numbers = "0" + numbers;

  return letters + "-" + numbers;
}

/* ISO → unix seconds */
function toUnix(dateStr) {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

/* =========================
   PROCESS
   ========================= */

var results = [];

for (var i = 0; i < matches.length; i++) {
  var m = matches[i];
  if (!m || !m.MatchId) continue;

  var endedUnix = toUnix(m.DateEnded);
  var ageSeconds = Math.max(0, Math.floor(NOW / 1000) - endedUnix);

  var y = BASE_Y + ageSeconds / Y_SCALE;
  var orbit = Math.max(10, Math.floor(y * ORBIT_SCALE));

  var slug = makeSlug(m.MatchId);

  results.push({
    meta: {
      id: "match--" + m.MatchId,
      displayName:
        "##" + slug + "##\n" +
        m.Corporation1Name + " vs " + m.Corporation2Name,
      icon: ICON_URL
    },
    onclick: {
      embed: false,
      data:
        "window.onMatchClick && window.onMatchClick(" +
        JSON.stringify({
          match: m.MatchId,
          slug: slug,
          c1: m.Corporation1Id,
          c2: m.Corporation2Id
        }) +
        ")"
    },
    coords: {
      y: y,
      parent: CORE_PARENT_ID,
      exist: endedUnix,
      orbit: orbit
    }
  });
}

/* =========================
   OUTPUT
   ========================= */

var output = {
  count: results.length,
  generated: Math.floor(NOW / 1000),
  results: results
};

output;
