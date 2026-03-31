// ---------------- CONFIG ----------------
const CONFIG = {
  LIMITS: {
    matchesPerCorp: 5
  },

  SEED: 12345, // base seed for random generation

  STAR_TEMPLATE: {
    rotation_cycle_duration: 3.99,
    min_y: 0,
    max_y: 45000,
    icon_url: "http://localhost:8080/api/src/standard_star_icons/hs/star_yellow.png",
    aura_color: "#ff6600",
    parent_id: "core_001"
  },

  INTERACTION_TEMPLATE: {
    clickable: true,
    data: {
      title: "{title}",
      description: "{description}",
      color: 16776960,
      image: {
        url: "http://localhost:8080/api/src/portraits/portrait_YellowStar.png"
      }
    }
  }
};

// ---------------- SEEDED RANDOM ----------------
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate a truly random seed per star
function randomSeed(baseSeed, index) {
  return Math.floor(seededRandom(baseSeed + index) * 100000);
}

// ---------------- ID GENERATOR ----------------
function generateId(seed) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let part1 = "";
  for (let i = 0; i < 3; i++) {
    part1 += letters[Math.floor(seededRandom(seed + i) * letters.length)];
  }
  const part2 = Math.floor(seededRandom(seed + 10) * 9000 + 1000);
  return `${part1}-${part2}`;
}

// ---------------- HELPERS ----------------
function cleanName(name) {
  return name.replace(/<[^>]*>/g, "").trim();
}

function pickMatchesForCorp(matches, corpId, limit) {
  return matches
    .filter(m => m.Corporation1Id === corpId || m.Corporation2Id === corpId)
    .slice(0, limit);
}

function getWinner(match) {
  if (match.Corporation1Score > match.Corporation2Score) return match.Corporation1Id;
  if (match.Corporation2Score > match.Corporation1Score) return match.Corporation2Id;
  return null; // draw
}

// ---------------- MOCK DATA ----------------

// Corps JSON
const CORPS_JSON = $$CORPS_JSON$$;

// Matches JSON
const MATCHES_JSON = $$MATCHES_JSON$$;

// ---------------- MAIN SCRIPT ----------------
function run() {
  const corps = CORPS_JSON.matches;
  const matches = MATCHES_JSON.matches;

  console.log(`Loaded corps: ${corps.length}`);
  console.log(`Loaded matches: ${matches.length}`);

  const output = [];

  corps.forEach((corp, index) => {
    const cleanCorpName = cleanName(corp.Name);
    console.log(`\nProcessing corp: ${cleanCorpName}`);

    const corpMatches = pickMatchesForCorp(matches, corp.Id, CONFIG.LIMITS.matchesPerCorp);
    console.log(`Found matches: ${corpMatches.length}`);

    corpMatches.forEach((match, i) => {
      const seedId = randomSeed(CONFIG.SEED, index * 100 + i);
      const winner = getWinner(match);
      const isWinner = winner === corp.Id;

      const opponentName =
        match.Corporation1Id === corp.Id
          ? match.Corporation2Name
          : match.Corporation1Name;

      const starId = generateId(seedId);
      const starName = `<${starId}> ${cleanCorpName} vs ${opponentName}`;

      console.log(`  Match -> ${starName} | Winner: ${winner}`);

      const description = `
Match between **${cleanCorpName}** and **${opponentName}**
Result: ${match.Corporation1Score} - ${match.Corporation2Score}
Winner: ${winner === corp.Id ? cleanCorpName : opponentName}
`;

      const star = {
        id: `${starId}-${seedId}`,
        seed_id: `${starId}`,
        display_name: starName,

        ...CONFIG.STAR_TEMPLATE,

        interaction: {
          ...CONFIG.INTERACTION_TEMPLATE,
          data: {
            ...CONFIG.INTERACTION_TEMPLATE.data,
            title: starName,
            description: description
          }
        },

        effects: isWinner
          ? [{ type: "highlight", value: "winner" }]
          : [{ type: "randomized", value: seededRandom(seedId) }]
      };

      output.push(star);
    });
  });

  console.log("\nDONE. Generated objects:", output.length);

  return output;
}

// ---------------- RUN SCRIPT ----------------
const finalOutput = run();
//console.log("\n=== FINAL JSON OUTPUT ===\n");
//console.log(JSON.stringify(finalOutput, null, 2));
//finalOutput;