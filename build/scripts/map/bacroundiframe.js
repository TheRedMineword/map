MapGen.initBackground = function (options = {}) {
  if (MapGen._bgInitialized) {
    console.warn("[MapGen] Background already initialized");
    return;
  }

async function genURL(options={}) {
  const {
    url = "https://theredmineword.github.io/map/build/iframe/spacesky.html",
    storageKey = "MapGen:lastDump.camera_pov",
    consoleLog = true
  } = options;

  // --- 1. Current Unix time ---
  const now = Math.floor(Date.now()/1000);
  
  // --- 2. SHA1 of current page URL ---
  const data = new TextEncoder().encode(window.location.href);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b=>b.toString(16).padStart(2,'0')).join('');

  // --- 3. Unique cachebypass code (change every 7min) ---
  const interval7min = Math.floor(now/420); // 7*60 = 420 sec
  const uniqueCode = `${interval7min}_${hashHex}`;

  if(consoleLog){
    console.log("Unix now:", now);
    console.log("Page URL:", window.location.href);
    console.log("SHA1 hash:", hashHex);
    console.log("Cachebypass code:", uniqueCode);
  }

  // --- 4. Build final URL ---
  const params = new URLSearchParams({
    localstoragekey: storageKey,
    console_log: consoleLog,
    cachebypass: uniqueCode
  });

  return `${url}?${params.toString()}`;
}

// --- Example usage ---
genURL().then(u=>console.log("Generated URL:", u));


  const root = MapGen.root || document.getElementById("mapgen-root");
  if (!root) {
    console.error("[MapGen] initBackground: root not found");
    return;
  }

  console.log("[MapGen] Initializing SpaceSky background");

  const iframe = document.createElement("iframe");
  iframe.src = `${url}?console_log=${consoleLog}&localstoragekey=${storageKey}`;
  iframe.style.position = "absolute";
  iframe.style.top = 0;
  iframe.style.left = 0;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.zIndex = zIndex;
  iframe.style.pointerEvents = "none"; // click-through

  root.prepend(iframe);

  // Make sure MapGen render layers sit above it
  if (MapGen.webglRenderer) {
    MapGen.webglRenderer.domElement.style.zIndex = zIndex + 1;
  }
  if (MapGen.labelRenderer) {
    MapGen.labelRenderer.domElement.style.zIndex = zIndex + 2;
  }

  MapGen.backgroundFrame = iframe;
  MapGen._bgInitialized = true;
};
