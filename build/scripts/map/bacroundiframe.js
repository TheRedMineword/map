MapGen.initBackground = function (options = {}) {
  if (MapGen._bgInitialized) {
    console.warn("[MapGen] Background already initialized");
    return;
  }

 const {
    url = "https://theredmineword.github.io/map/build/iframe/spacesky.html?seed=14538813200003909555102544617742408999842954385294",
    storageKey = "MapGen:lastDump.camera_pov",
    consoleLog = false,
    zIndex = 0
  } = options;
console.log(url);






  const root = MapGen.root || document.getElementById("mapgen-root");
  if (!root) {
    console.error("[MapGen] initBackground: root not found");
    return;
  }

  console.log("[MapGen] Initializing SpaceSky background");


var storagebypass = (function(){
  const now = Math.floor(Date.now()/1000);
  const interval7min = Math.floor(now / 420); // changes every 7 min

  const str = window.location.href;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const hashHex = (hash >>> 0).toString(16);

  console.log("Unix now:", now);
  console.log("Page URL:", str);
  console.log("Hash:", hashHex);
  console.log("Bypass:", interval7min + "_" + hashHex);

  return interval7min + "_" + hashHex;
})();


  
  const iframe = document.createElement("iframe");
  iframe.src = `${url}&console_log=${consoleLog}&localstoragekey=${storageKey}&bypass=${storagebypass}`;
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
