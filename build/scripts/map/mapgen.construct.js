/* ============================================================
   MAPGEN.CONSTRUCT.JS
   Scene + Object Construction (NO animation)
   ============================================================ */

console.log("[MapGen] construct.js loaded");

window.MapGen = window.MapGen || {};
MapGen.objects = new Map();

/* =========================
   INIT
   ========================= */

MapGen.init = function () {
  console.log("[MapGen] init()");

  const root = document.createElement("div");
  root.id = "mapgen-root";
  root.style.position = "fixed";
  root.style.inset = "0";
  root.style.pointerEvents = "none"; // important
  document.body.appendChild(root);

  MapGen.scene = new THREE.Scene();
  console.log("[MapGen] scene created");

  MapGen.camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  MapGen.camera.position.z = 1000;
  console.log("[MapGen] camera created");

  MapGen.labelRenderer = new CSS2DRenderer();
  MapGen.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  MapGen.labelRenderer.domElement.style.position = "absolute";
  MapGen.labelRenderer.domElement.style.top = "0";
  MapGen.labelRenderer.domElement.style.pointerEvents = "none";
  root.appendChild(MapGen.labelRenderer.domElement);

  console.log("[MapGen] CSS2DRenderer attached");

  window.addEventListener("resize", MapGen._onResize);
};

/* =========================
   INTERNAL
   ========================= */

MapGen._onResize = function () {
  console.log("[MapGen] resize");
  MapGen.camera.aspect = window.innerWidth / window.innerHeight;
  MapGen.camera.updateProjectionMatrix();
  MapGen.labelRenderer.setSize(window.innerWidth, window.innerHeight);
};

MapGen._createObject = function (obj) {
  console.log("[MapGen] creating object", obj?.meta?.id, obj);

  const wrapper = new THREE.Object3D();

  const el = document.createElement("div");
  el.className = "mapgen-object";
  el.style.pointerEvents = "auto";

  if (obj.meta?.icon) {
    const img = document.createElement("img");
    img.src = obj.meta.icon;
    img.width = 32;
    img.height = 32;
    img.draggable = false;
    el.appendChild(img);
  }

  if (obj.meta?.displayName) {
    console.log("[MapGen] label text:", obj.meta.displayName);
    const label = document.createElement("div");
    label.className = "mapgen-label";
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
  if (!obj?.meta?.id) {
    console.warn("[MapGen] push() missing meta.id", obj);
    return;
  }

  let entry = MapGen.objects.get(obj.meta.id);

  if (!entry) {
    console.log("[MapGen] push() new object", obj.meta.id);
    const node = MapGen._createObject(obj);
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

MapGen._ready = true;
console.log("[MapGen] READY");
