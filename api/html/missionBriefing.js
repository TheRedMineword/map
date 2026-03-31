(async function loadMissionBriefing() {
  const base = "https://theredmineword.github.io/map/api";

  console.log("[Briefing] Script started");

  try {
    // ===== STEP 1: FETCH ID =====
    const idUrl = `${base}/bigalert?jam=${Math.random()}`;
    console.log("[Briefing] Fetching ID from:", idUrl);

    const idRes = await fetch(idUrl);
    console.log("[Briefing] ID response status:", idRes.status);

    const idData = await idRes.json();
    console.log("[Briefing] ID response data:", idData);

    // FIX: API returns raw ID (e.g. 0)
    const newId = idData;
    console.log("[Briefing] Extracted ID:", newId);

    // FIX: allow 0, only block null/undefined/empty
    if (newId === undefined || newId === null || newId === "") {
      console.warn("[Briefing] Invalid ID, stopping.");
      return;
    }

    const shownId = localStorage.getItem("mission_briefing_shown_id");
    console.log("[Briefing] Stored ID:", shownId);

    // FIX: compare as strings (avoids 0 vs "0" issues)
    if (String(newId) === String(shownId)) {
      console.log("[Briefing] ID already shown, skipping.");
      return;
    }

    // ===== STEP 2: FETCH FULL BRIEFING =====
    const briefingUrl = `${base}/big_alerts/${newId}?jam=${Math.random()}`;
    console.log("[Briefing] Fetching full briefing from:", briefingUrl);

    const briefingRes = await fetch(briefingUrl);
    console.log("[Briefing] Briefing response status:", briefingRes.status);

    if (!briefingRes.ok) {
      console.error("[Briefing] Failed to fetch briefing!");
      return;
    }

    const data = await briefingRes.json();
    console.log("[Briefing] Full briefing data:", data);

    // Save ID AFTER successful fetch
    localStorage.setItem("mission_briefing_shown_id", String(newId));
    console.log("[Briefing] Saved new ID");

    // ===== UI =====

    const style = document.createElement("style");
    style.textContent = `
      .briefing-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: Arial, sans-serif;
      }

      .briefing-loader {
        text-align: center;
        color: white;
        font-size: 1.2em;
        padding: 20px 40px;
        border: 1px solid ${data.box.lines_outline_hex};
        background: rgba(0, 0, 0, 0.92);
        box-shadow: 0 0 15px ${data.box.lines_outline_hex};
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      }
      .briefing-loader hr {
        border: none;
        border-top: 1px solid ${data.box.lines_outline_hex};
        margin: 0;
      }

      .briefing-box {
        position: relative;
        background: rgba(0, 0, 0, 0.92);
        border: 1px solid ${data.box.lines_outline_hex};
        box-shadow: 0 0 20px ${data.box.lines_outline_hex};
        padding: 20px 30px;
        max-width: 600px;
        width: 90%;
        border-radius: 10px;
        color: white;
        text-align: left;
      }

      .briefing-small-text-box {
        position: absolute;
        top: -35px;
        right: -1px;
        background: rgba(0, 0, 0, 0.95);
        padding: 5px 10px;
        border: 1px solid ${data.box.lines_outline_hex};
        border-right: none;
        border-top: none;
        border-radius: 5px 0 0 0;
        font-size: 0.85em;
        color: white;
      }

      .briefing-banner {
        width: 100%;
        border-radius: 6px;
        margin-bottom: 15px;
      }

      .briefing-header {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 1.8em;
        font-weight: bold;
        margin: 10px 0;
        padding: 10px 0;
        border-top: 1px solid ${data.box.lines_outline_hex};
        border-bottom: 1px solid ${data.box.lines_outline_hex};
      }

      .briefing-logo {
        width: 50px;
        height: auto;
      }

      .briefing-scrollable-text {
        margin: 15px 0;
        font-size: 1em;
        line-height: 1.5em;
        max-height: 15vh;
        overflow-y: auto;
        padding-right: 5px;
      }

      .briefing-button {
        margin-top: 10px;
        padding: 10px 20px;
        background-color: ${data.box.lines_outline_hex};
        border: none;
        color: white;
        cursor: pointer;
        border-radius: 5px;
        font-weight: bold;
      }

      .briefing-button:hover {
        opacity: 0.9;
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.className = "briefing-overlay";

    // Show loading screen first
    const loader = document.createElement("div");
    loader.className = "briefing-loader";
    loader.innerHTML = `
      <hr>
      <div>${data.load?.text || "Loading briefing..."}</div>
      <hr>
    `;
    overlay.appendChild(loader);
    document.body.appendChild(overlay);

    // Wait before replacing loader
    const duration = parseInt(data.load?.duration_ms) || 3000;
    await new Promise((res) => setTimeout(res, duration));

    // Replace loader with main box
    overlay.innerHTML = `
      <div class="briefing-box">
        <div class="briefing-small-text-box">${data.small_text.text}</div>
        <img class="briefing-banner" src="${data.images.banner}" alt="Banner" />
        <div class="briefing-header">
          <img class="briefing-logo" src="${data.images.logo}" alt="Logo" />
          <div>${data.box.title}</div>
        </div>
        <div class="briefing-scrollable-text">${data.box.text.replace(/\n/g, "<br>")}</div>
        <button class="briefing-button">${data.button.name}</button>
      </div>
    `;

    const btn = overlay.querySelector(".briefing-button");

    if (!btn) {
      console.error("[Briefing] Button not found!");
      return;
    }

    btn.addEventListener("click", () => {
      console.log("[Briefing] Closing overlay");
      overlay.remove();
    });

    console.log("[Briefing] DONE");

  } catch (e) {
    console.error("[Briefing] ERROR:", e);
  }
})();