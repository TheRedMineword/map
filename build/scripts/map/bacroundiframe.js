MapGen.initBackground = function (options = {}) {
  if (MapGen._bgInitialized) {
    console.warn("[MapGen] Background already initialized");
    return;
  }

function generateBaseBackgroundURLSync(
  base = "https://theredmineword.github.io/map/build/iframe/spacesky.html"
){
  // --- Unix time (changes every 7 minutes) ---
  const now = Math.floor(Date.now()/1000);
  const interval7min = Math.floor(now / 420);

  // --- Fast string hash of current page URL ---
  const str = window.location.href;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // force 32-bit
  }
  const hashHex = (hash >>> 0).toString(16);

  const bypass = `${interval7min}_${hashHex}`;

  console.log("Unix now:", now);
  console.log("Page URL:", str);
  console.log("Hash:", hashHex);
  console.log("Bypass:", bypass);

  return `${base}?bypass=${bypass}`;
}


  
const {
  url = generateBaseBackgroundURLSync(),
  storageKey = "MapGen:lastDump.camera_pov",
  consoleLog = false,
  zIndex = 0
} = options;





  const root = MapGen.root || document.getElementById("mapgen-root");
  if (!root) {
    console.error("[MapGen] initBackground: root not found");
    return;
  }

  console.log("[MapGen] Initializing SpaceSky background");

  const iframe = document.createElement("iframe");
  iframe.src = `${url}&console_log=${consoleLog}&localstoragekey=${storageKey}`;
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
