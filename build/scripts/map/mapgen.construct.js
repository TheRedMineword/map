/* ============================================================
   MAPGEN.CONSTRUCT.JS
   Scene + Object Construction (NO animation)
   ============================================================ */

console.log("[MapGen] construct.js loaded");

window.MapGen = window.MapGen || {};
MapGen.objects = MapGen.objects || new Map();
MapGen._ready = false;
MapGen._started = false;


/* =========================
   INIT
   ========================= */

MapGen._injectStyles = function () {

  if (document.getElementById("mapgen-styles")) return;

  const style = document.createElement("style");
  style.id = "mapgen-styles";

  style.textContent = `
  
  .mapgen-object{
    display:flex;
    flex-direction:column;
    align-items:center;
    position:relative;
  }

  .mapgen-label{
    color:white;
    white-space:pre-line;
    font-size:12px;
    text-align:center;
    margin-top:2px;
    font-family:sans-serif;
    pointer-events:none;
  }

  `;

  document.head.appendChild(style);

  console.log("[MapGen] styles injected");
};






MapGen.init = function (root) {
  if (MapGen._ready) {
    console.warn("[MapGen] init() already called — skipped");
    return;
  }

  console.log("[MapGen] init()");
  if (!root) throw new Error("MapGen.init requires root");

  MapGen.root = root;

   console.log("MapGen._injectStyles();");
MapGen._injectStyles();
   
  MapGen.scene = new THREE.Scene();

  MapGen.camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );

  MapGen.camera.position.set(0, 0, 2000);
  MapGen.camera.lookAt(0, 0, 0);

  MapGen.webglRenderer = new THREE.WebGLRenderer({ alpha: true });
  MapGen.webglRenderer.setSize(window.innerWidth, window.innerHeight);
  MapGen.webglRenderer.domElement.style.position = "absolute";
  root.appendChild(MapGen.webglRenderer.domElement);

  MapGen.labelRenderer = new CSS2DRenderer();
  MapGen.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  MapGen.labelRenderer.domElement.style.position = "absolute";
  MapGen.labelRenderer.domElement.style.pointerEvents = "none";
  root.appendChild(MapGen.labelRenderer.domElement);

  window.addEventListener("resize", MapGen._onResize);

  MapGen._ready = true;
  console.log("[MapGen] READY");
};



/* =========================
   INTERNAL
   ========================= */

//on resize moved away to camera

MapGen._createObject = function (obj) {
  console.log("[MapGen] creating object", obj?.meta?.id, obj);

  const wrapper = new THREE.Object3D();

  const el = document.createElement("div");
  el.className = "mapgen-object";
  el.style.pointerEvents = "auto";
  el.style.position = "relative";
  el.style.display = "flex";
  el.style.flexDirection = "column";
  el.style.alignItems = "center";

  let auraColor = "#00eaff";
  let auraSize = 10;

  if (obj.meta?.aura) {
    auraColor = obj.meta.aura.hex || auraColor;
    auraSize = obj.meta.aura.size || auraSize;
  }

  if (obj.meta?.icon) {

    const iconWrap = document.createElement("div");
    iconWrap.style.position = "relative";

    const img = document.createElement("img");
    img.src = obj.meta.icon;
    img.width = 32;
    img.height = 32;
    img.draggable = false;

    img.style.filter =
      `drop-shadow(0 0 ${auraSize}px ${auraColor})`;

    iconWrap.appendChild(img);
    el.appendChild(iconWrap);
  }

  if (obj.meta?.displayName) {
    console.log("[MapGen] label text:", obj.meta.displayName);

    const label = document.createElement("div");
    label.className = "mapgen-label";

    label.style.color = "white";
    label.style.whiteSpace = "pre-line";

    label.textContent = obj.meta.displayName;

    el.appendChild(label);
  }

  el.addEventListener("click", (e) => {
    console.log("[MapGen] DOM click", obj.meta?.id);
    e.stopPropagation();

    if (typeof window.MapGenOnClick === "function") {
      window.MapGenOnClick(obj);
    } else {
      console.warn("[MapGen] MapGenOnClick not defined");
    }
  });

  const labelObj = new CSS2DObject(el);
  wrapper.add(labelObj);

  return wrapper;
};

MapGen._resolvePosition = function (obj) {
  const pos = {
    x: 0,
    y: obj.coords?.y || 0,
    z: obj.coords?.orbit || 0
  };

  console.log("[MapGen] resolved position", obj.meta?.id, pos);
  return pos;
};

/* =========================
   PUBLIC API
   ========================= */

MapGen.push = function (obj) {
  if (!MapGen._ready) {
    console.warn("[MapGen] push() called before init — ignored", obj);
    return;
  }

  if (!obj?.meta?.id) {
    console.warn("[MapGen] push() missing meta.id", obj);
    return;
  }

  let entry = MapGen.objects.get(obj.meta.id);

  if (!entry) {
    console.log("[MapGen] push() new object", obj.meta.id);

    const node = MapGen._createObject(obj);

    if (!MapGen.scene) {
      console.error("[MapGen] scene missing despite ready=true");
      return;
    }

    MapGen.scene.add(node);

    entry = {
      obj,
      node,
      targetPos: new THREE.Vector3()
    };

    MapGen.objects.set(obj.meta.id, entry);
  } else {
    console.log("[MapGen] push() update object", obj.meta.id);
    entry.obj = obj;
  }

  const p = MapGen._resolvePosition(obj);
  entry.targetPos.set(p.x, p.y, p.z);
};


MapGen.remove = function (id) {
  console.log("[MapGen] remove()", id);
  const entry = MapGen.objects.get(id);
  if (!entry) return;

  MapGen.scene.remove(entry.node);
  MapGen.objects.delete(id);
};

MapGen.clear = function () {
  console.log("[MapGen] clear()");
  MapGen.objects.forEach((e) => MapGen.scene.remove(e.node));
  MapGen.objects.clear();

};

//MapGen._ready = true;
//console.log("[MapGen] READY");








