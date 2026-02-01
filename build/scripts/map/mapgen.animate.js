/* ============================================================
   MAPGEN.ANIMATE.JS
   Render loop + smoothing
   ============================================================ */

console.log("[MapGen] animate.js loaded");

// MapGen.labelRenderer.domElement.style.zIndex = "9999";
MapGen._lastTime = performance.now();

MapGen.animate = function (time = performance.now()) {

if (!MapGen.webglRenderer || !MapGen.labelRenderer) {
  console.warn("[MapGen] animate skipped — renderer missing");
  requestAnimationFrame(MapGen.animate);
  return;
}

   
  if (!MapGen._lastTime) MapGen._lastTime = time;
  const dt = Math.min(0.1, (time - MapGen._lastTime) / 1000);
  MapGen._lastTime = time;

  MapGen.objects.forEach((entry) => {
    if (!entry.targetPos) return;
    entry.node.position.lerp(entry.targetPos, Math.min(1, dt * 6));
  });

  MapGen.webglRenderer.render(MapGen.scene, MapGen.camera);
  MapGen.labelRenderer.render(MapGen.scene, MapGen.camera);

  requestAnimationFrame(MapGen.animate);
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






