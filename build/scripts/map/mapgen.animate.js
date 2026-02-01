/* ============================================================
   MAPGEN.ANIMATE.JS
   Render loop + smoothing
   ============================================================ */

console.log("[MapGen] animate.js loaded");

// MapGen.labelRenderer.domElement.style.zIndex = "9999";
MapGen._lastTime = performance.now();

MapGen.animate = function (time = performance.now()) {
  if (!MapGen._started) return;

  if (!MapGen.scene || !MapGen.camera) {
    requestAnimationFrame(MapGen.animate);
    return;
  }

  if (MapGen.webglRenderer) {
    MapGen.webglRenderer.render(MapGen.scene, MapGen.camera);
  }

  if (MapGen.labelRenderer) {
    MapGen.labelRenderer.render(MapGen.scene, MapGen.camera);
  }

  requestAnimationFrame(MapGen.animate);
   //console.count("frame");

};




// start loop explicitly
// MapGen.init();
MapGen.init(root);



MapGen.start = function () {
  if (!MapGen._ready) {
    console.warn("[MapGen] start() called before init");
    return;
  }

  if (MapGen._started) return;
  MapGen._started = true;

  console.log("[MapGen] animation started");
  requestAnimationFrame(MapGen.animate);
};






MapGen.start();









