// ==== ::= MAPGEN.DUMP.JS =:: ==== //
// Camera + Scene dump logic (event + interval driven)

console.log("[MapGen] dump.js loaded");

MapGen._frameCount = 0;
MapGen._lastDump = 0;
MapGen.DUMP_INTERVAL = 500; // ms
MapGen.CAMERA_EPSILON = 0.001;

MapGen._lastCameraState = null;

/* =========================
   CAMERA STATE
   ========================= */

MapGen._getCameraState = function () {
  const c = MapGen.camera;
  return {
    px: c.position.x,
    py: c.position.y,
    pz: c.position.z,
    rx: c.rotation.x,
    ry: c.rotation.y,
    rz: c.rotation.z,
    zoom: c.zoom
  };
};

MapGen._cameraChanged = function (a, b) {
  if (!a || !b) return true;

  for (const k in a) {
    if (Math.abs(a[k] - b[k]) > MapGen.CAMERA_EPSILON) {
      return true;
    }
  }
  return false;
};

/* =========================
   SCENE SNAPSHOT
   ========================= */

MapGen._getSceneDump = function () {
  const out = {};

  MapGen.objects.forEach((entry, id) => {
    out[id] = {
      position: {
        x: entry.node.position.x,
        y: entry.node.position.y,
        z: entry.node.position.z
      },
      targetPos: {
        x: entry.targetPos.x,
        y: entry.targetPos.y,
        z: entry.targetPos.z
      },
      meta: entry.obj?.meta || null
    };
  });

  return out;
};

/* =========================
   DUMP
   ========================= */

MapGen.dumpFrame = function () {
  const dump = {
    frame: MapGen._frameCount,
    time: performance.now(),
    map: MapGen._getSceneDump(),
    camera: {
      fov: MapGen.camera.fov,
      near: MapGen.camera.near,
      far: MapGen.camera.far,
      aspect: MapGen.camera.aspect
    },
    camera_pov: MapGen._getCameraState()
  };

  localStorage.setItem("MapGen:lastDump", JSON.stringify(dump));
};

/* =========================
   DUMP TRIGGER
   ========================= */

MapGen.maybeDump = function (time) {
  if (!MapGen.camera) return;

  const nowState = MapGen._getCameraState();
  const moved = MapGen._cameraChanged(nowState, MapGen._lastCameraState);
  const intervalHit = (time - MapGen._lastDump) > MapGen.DUMP_INTERVAL;

  if (moved || intervalHit) {
    MapGen._lastDump = time;
    MapGen._lastCameraState = nowState;
    MapGen.dumpFrame();
  }
};
