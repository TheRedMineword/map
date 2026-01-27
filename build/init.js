log("[INITIATION] STARTING MAP LOAD");
const logo_ascii = "          _____                    _____                    _____                    _____          \r\n         /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\         \r\n        /::\\____\\                /::\\    \\                /::\\____\\                /::\\    \\        \r\n       /::::|   |               /::::\\    \\              /::::|   |               /::::\\    \\       \r\n      /:::::|   |              /::::::\\    \\            /:::::|   |              /::::::\\    \\      \r\n     /::::::|   |             /:::/\\:::\\    \\          /::::::|   |             /:::/\\:::\\    \\     \r\n    /:::/|::|   |            /:::/__\\:::\\    \\        /:::/|::|   |            /:::/__\\:::\\    \\    \r\n   /:::/ |::|   |           /::::\\   \\:::\\    \\      /:::/ |::|   |           /::::\\   \\:::\\    \\   \r\n  /:::/  |::|___|______    /::::::\\   \\:::\\    \\    /:::/  |::|___|______    /::::::\\   \\:::\\    \\  \r\n /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\ ___\\  /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\ ___\\ \r\n/:::/    |:::::::::\\____\\/:::/__\\:::\\   \\:::|    |/:::/    |:::::::::\\____\\/:::/__\\:::\\   \\:::|    |\r\n\\::/    / ~~~~~/:::/    /\\:::\\   \\:::\\  /:::|____|\\::/    / ~~~~~/:::/    /\\:::\\   \\:::\\  /:::|____|\r\n \\/____/      /:::/    /  \\:::\\   \\:::\\/:::/    /  \\/____/      /:::/    /  \\:::\\   \\:::\\/:::/    / \r\n             /:::/    /    \\:::\\   \\::::::/    /               /:::/    /    \\:::\\   \\::::::/    /  \r\n            /:::/    /      \\:::\\   \\::::/    /               /:::/    /      \\:::\\   \\::::/    /   \r\n           /:::/    /        \\:::\\  /:::/    /               /:::/    /        \\:::\\  /:::/    /    \r\n          /:::/    /          \\:::\\/:::/    /               /:::/    /          \\:::\\/:::/    /     \r\n         /:::/    /            \\::::::/    /               /:::/    /            \\::::::/    /      \r\n        /:::/    /              \\::::/    /               /:::/    /              \\::::/    /       \r\n        \\::/    /                \\::/____/                \\::/    /                \\::/____/        \r\n         \\/____/                  ~~                       \\/____/                  ~~              \r\n                                                                                                    ";
logascii(logo_ascii);
log("[WARN] BOOTING");





/* ============================================================
   INIT.JS
   Script loader + MapGen bootstrap
   ============================================================ */

console.log("[Init] init.js loaded");

async function loadScript(url) {
  return new Promise((resolve, reject) => {
    console.log("[Init] loading script:", url);

    const script = document.createElement("script");
    script.src = url;
    script.onload = () => {
      console.log("[Init] loaded:", url);
      resolve();
    };
    script.onerror = (e) => {
      console.error("[Init] failed to load:", url, e);
      reject(e);
    };

    document.head.appendChild(script);
  });
}

/* =========================
   CLEANUP
   ========================= */

function cleanupMapGen() {
  console.log("[Init] cleanupMapGen()");

  // remove root container
  const oldRoot = document.getElementById("mapgen-root");
  if (oldRoot) {
    console.log("[Init] removing old mapgen-root");
    oldRoot.remove();
  }

  // clear MapGen state if exists
  if (window.MapGen) {
    console.log("[Init] clearing MapGen state");

    if (MapGen.objects) MapGen.objects.clear();
    MapGen.scene = null;
    MapGen.camera = null;
    MapGen.labelRenderer = null;
  }
}

/* =========================
   BOOTSTRAP
   ========================= */

(async () => {
  try {
    await loadScript("https://cdn.jsdelivr.net/npm/three@0.131.1/build/three.min.js");
    await loadScript(
      "https://cdn.jsdelivr.net/npm/three@0.131.1/examples/js/renderers/CSS2DRenderer.js"
    );

    // expose CSS2D helpers globally
    window.CSS2DRenderer = THREE.CSS2DRenderer;
    window.CSS2DObject   = THREE.CSS2DObject;

    console.log("[Init] THREE + CSS2D ready");

    cleanupMapGen();

     
  if (typeof window.vars.JAVASCRIPT_SOURCE === "string") {
    eval(window.vars.JAVASCRIPT_SOURCE);
  }

  // Now you can safely use it anywhere
  MapGen.labelRenderer = new CSS2DRenderer();
  MapGen.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(MapGen.labelRenderer.domElement);


     
  } catch (err) {
    console.error("[Init] fatal error", err);
  }
})();
