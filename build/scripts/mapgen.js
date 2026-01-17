/* ============================================================
   MAPGEN.JS — Minimal Map Element Processor
   ------------------------------------------------------------
   Responsibilities:
   - Store map objects
   - Create / update / remove DOM elements
   - Handle onclick logic
   - Resolve simple positions (no movement yet)

   NOT included:
   - camera
   - movement
   - background
   - persistence
   - fetch / async
   ============================================================ */

/* =========================
   GLOBAL STATE
   ========================= */

window.MapGen = {};
MapGen.objects = new Map();
MapGen.root = document.body;

/* =========================
   INTERNAL HELPERS
   ========================= */

/**
 * Creates a DOM element for a map object
 */
MapGen._createElement = function (obj) {
  var el = document.createElement("div");
  el.className = "mapgen-object";
  el.style.position = "absolute";
  el.style.pointerEvents = "auto";
  el.style.transform = "translate(-50%, -50%)";

  // icon
  if (obj.meta && obj.meta.icon) {
    var img = document.createElement("img");
    img.src = obj.meta.icon;
    img.width = 32;
    img.height = 32;
    img.draggable = false;
    el.appendChild(img);
  }

  // label
  if (obj.meta && obj.meta.displayName) {
    var label = document.createElement("div");
    label.className = "mapgen-label";
    label.textContent = obj.meta.displayName;
    el.appendChild(label);
  }

  // click handler
  el.addEventListener("click", function (e) {
    e.stopPropagation();

    var onclick = obj.onclick;
    if (!onclick) return;

    // embed handler
    if (onclick.embed === true && typeof window.createEmbed === "function") {
      window.createEmbed(onclick.data || {});
      return;
    }

    // script handler
    if (onclick.embed === false && typeof onclick.data === "string") {
      try {
        new Function(onclick.data)();
      } catch (err) {
        console.warn("[MapGen] onclick script error:", err);
      }
    }
  });

  MapGen.root.appendChild(el);
  return el;
};

/**
 * Resolve object screen position (no camera, no orbit yet)
 */
MapGen._resolvePosition = function (obj) {
  var y = 0;

  if (obj.coords && typeof obj.coords.y === "number") {
    y = obj.coords.y;
  }

  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2 + y
  };
};

/* =========================
   PUBLIC API
   ========================= */

/**
 * Push or update a map object
 */
MapGen.push = function (obj) {
  if (!obj || !obj.meta || !obj.meta.id) {
    console.warn("[MapGen.push] missing meta.id");
    return;
  }

  var id = obj.meta.id;
  var entry = MapGen.objects.get(id);

  if (!entry) {
    var el = MapGen._createElement(obj);
    entry = {
      obj: obj,
      el: el
    };
    MapGen.objects.set(id, entry);
  } else {
    entry.obj = obj;
  }
};

/**
 * Remove a map object
 */
MapGen.remove = function (id) {
  var entry = MapGen.objects.get(id);
  if (!entry) return;

  entry.el.remove();
  MapGen.objects.delete(id);
};

/**
 * Clear all map objects
 */
MapGen.clear = function () {
  MapGen.objects.forEach(function (entry) {
    entry.el.remove();
  });
  MapGen.objects.clear();
};

/**
 * Recalculate positions (call manually or in a loop later)
 */
MapGen.render = function () {
  MapGen.objects.forEach(function (entry) {
    var pos = MapGen._resolvePosition(entry.obj);
    entry.el.style.left = pos.x + "px";
    entry.el.style.top = pos.y + "px";
  });
};

/* =========================
   OPTIONAL: BASIC STYLES
   ========================= */

(function injectStyles() {
  var style = document.createElement("style");
  style.textContent = `
    .mapgen-object {
      text-align: center;
      font-family: sans-serif;
      color: white;
      cursor: pointer;
      user-select: none;
    }
    .mapgen-label {
      font-size: 12px;
      margin-top: 4px;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);
})();
