/* ============================================================
   INIT.JS
   Full MapGen bootstrap + clean black HTML
   ============================================================ */

console.log("[Init] init.js loaded");

// -----------------------------
// 1️⃣ Reset page to plain black
// -----------------------------
function resetPageToBlack() {
  document.documentElement.innerHTML = "";
  document.documentElement.style.margin = "0";
  document.documentElement.style.padding = "0";
  document.documentElement.style.background = "black";

  const body = document.createElement("body");
  body.style.margin = "0";
  body.style.padding = "0";
  body.style.background = "black";
  body.style.overflow = "hidden";

  document.documentElement.appendChild(body);
  console.log("[Init] page reset to black");
}
resetPageToBlack();

// -----------------------------
// 2️⃣ Create root container
// -----------------------------
const root = document.createElement("div");
root.id = "mapgen-root";
root.style.position = "fixed";
root.style.inset = "0";
root.style.background = "black";
document.body.appendChild(root);
console.log("[Init] mapgen-root created");

// -----------------------------
// 3️⃣ Script loader
// -----------------------------
async function loadScript(url) {
  return new Promise((resolve, reject) => {
    console.log("[Init] loading script:", url);
    const s = document.createElement("script");
    s.src = url;
    s.onload = () => {
      console.log("[Init] loaded:", url);
      resolve();
    };
    s.onerror = (e) => {
      console.error("[Init] failed to load:", url, e);
      reject(e);
    };
    document.head.appendChild(s);
  });
}

// -----------------------------
// 4️⃣ Bootstrap sequence
// -----------------------------
(async () => {
  try {
    // Load Three.js
    await loadScript("https://cdn.jsdelivr.net/npm/three@0.131.1/build/three.min.js");
    // Load CSS2DRenderer
    await loadScript("https://cdn.jsdelivr.net/npm/three@0.131.1/examples/js/renderers/CSS2DRenderer.js");

    // Expose globally
    window.CSS2DRenderer = THREE.CSS2DRenderer;
    window.CSS2DObject   = THREE.CSS2DObject;

    console.log("[Init] THREE + CSS2D ready");

    // Evaluate injected MapGen scripts
    if (typeof window.vars?.JAVASCRIPT_SOURCE === "string") {
      console.log("[Init] evaluating injected MapGen code");
      eval(window.vars.JAVASCRIPT_SOURCE);
    }

    // -----------------------------
    // 5️⃣ Initialize MapGen
    // -----------------------------
    if (!window.MapGen || typeof MapGen.init !== "function") {
      throw new Error("[Init] MapGen.init() missing");
    }

    console.log("[Init] calling MapGen.init()");
    MapGen.init(root);

    console.log("[Init] calling MapGen.start()");
    MapGen.start();

    console.log("[Init] MapGen bootstrap complete:", {
      ready: MapGen._ready,
      scene: !!MapGen.scene,
      camera: !!MapGen.camera,
      renderer: !!MapGen.labelRenderer
    });

  } catch (err) {
    console.error("[Init] fatal error", err);
  }
})();
