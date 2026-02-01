console.log("[HELPER] Console logger loading");

MapGen.DEBUG = new URLSearchParams(location.search).get("debug") === "true";

MapGen.log = function (...args) {
  if (MapGen.DEBUG) console.log(...args);
};
