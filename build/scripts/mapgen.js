/* ============================================================
   MAPGEN.JS — Three.js + CSS2D Minimal Map
   ============================================================ */

window.MapGen = {};
MapGen.objects = new Map();

/* =========================
   INIT
   ========================= */

MapGen.init = function () {
  // root
  const root = document.createElement("div");
  root.id = "mapgen-root";
  root.style.position = "fixed";
  root.style.inset = "0";
  document.body.appendChild(root);

  // three basics
  MapGen.scene = new THREE.Scene();

  MapGen.camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  MapGen.camera.position.z = 1000;

  // CSS2D renderer
  MapGen.labelRenderer = new THREE.CSS2DRenderer();
  MapGen.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  MapGen.labelRenderer.domElement.style.position = "absolute";
  MapGen.labelRenderer.domElement.style.top = "0";
  root.appendChild(MapGen.labelRenderer.domElement);

  window.addEventListener("resize", MapGen._onResize);
};

/* =========================
   INTERNAL
   ========================= */

MapGen._onResize = function () {
  MapGen.camera.aspect = window.innerWidth / window.innerHeight;
  MapGen.camera.updateProjectionMatrix();
  MapGen.labelRenderer.setSize(window.innerWidth, window.innerHeight);
};

MapGen._createObject = function (obj) {
  const wrapper = new THREE.Object3D();

  // DOM element
  const el = document.createElement("div");
  el.className = "mapgen-object";

  if (obj.meta?.icon) {
    const img = document.createElement("img");
    img.src = obj.meta.icon;
    img.width = 32;
    img.height = 32;
    img.draggable = false;
    el.appendChild(img);
  }

  if (obj.meta?.displayName) {
    const label = document.createElement("div");
    label.className = "mapgen-label";
    label.textContent = obj.meta.displayName;
    el.appendChild(label);
  }

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    const onclick = obj.onclick;
    if (!onclick) return;

    if (onclick.embed === true && window.createEmbed) {
      window.createEmbed(onclick.data || {});
    } else if (onclick.embed === false && typeof onclick.data === "string") {
      try {
        new Function(onclick.data)();
      } catch (err) {
        console.warn("[MapGen] onclick error", err);
      }
    }
  });

  const labelObj = new THREE.CSS2DObject(el);
  wrapper.add(labelObj);

  return wrapper;
};

MapGen._resolvePosition = function (obj) {
  return {
    x: 0,
    y: obj.coords?.y || 0,
    z: obj.coords?.orbit || 0
  };
};

/* =========================
   PUBLIC API
   ========================= */

MapGen.push = function (obj) {
  if (!obj?.meta?.id) return;

  let entry = MapGen.objects.get(obj.meta.id);

  if (!entry) {
    const node = MapGen._createObject(obj);
    MapGen.scene.add(node);

    entry = { obj, node };
    MapGen.objects.set(obj.meta.id, entry);
  } else {
    entry.obj = obj;
  }

  const p = MapGen._resolvePosition(obj);
  entry.node.position.set(p.x, p.y, p.z);
};

MapGen.remove = function (id) {
  const entry = MapGen.objects.get(id);
  if (!entry) return;
  MapGen.scene.remove(entry.node);
  MapGen.objects.delete(id);
};

MapGen.clear = function () {
  MapGen.objects.forEach((e) => MapGen.scene.remove(e.node));
  MapGen.objects.clear();
};

MapGen.render = function () {
  MapGen.labelRenderer.render(MapGen.scene, MapGen.camera);
};
