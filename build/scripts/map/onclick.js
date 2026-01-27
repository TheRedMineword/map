/* ============================================================
   MAPGEN.ONCLICK.JS
   Object interaction logic
   ============================================================ */

console.log("[MapGen] onclick.js loaded");

window.MapGenOnClick = function (obj) {
  console.log("[MapGen] OnClick handler fired", obj.meta?.id, obj);

  if (!obj.onclick) {
    console.warn("[MapGen] no onclick data");
    return;
  }

  try {
    if (obj.onclick.embed === true && window.createEmbed) {
      console.log("[MapGen] embed true");
      window.createEmbed(obj.onclick.data || {});
    } else if (obj.onclick.embed === false && typeof obj.onclick.data === "string") {
      console.log("[MapGen] executing code string");
      new Function(obj.onclick.data)();
    } else {
      console.warn("[MapGen] unknown onclick format", obj.onclick);
    }
  } catch (err) {
    console.error("[MapGen] onclick error", err);
  }
};
