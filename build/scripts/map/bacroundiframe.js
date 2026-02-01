MapGen.initBackground = function (options = {}) {
  if (MapGen._bgInitialized) {
    console.warn("[MapGen] Background already initialized");
    return;
  }

  const {
    url = "https://theredmineword.github.io/map/build/iframe/spacesky.html",
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
