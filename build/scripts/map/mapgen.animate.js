/* ============================================================
   MAPGEN.ANIMATE.JS
   Render loop + smoothing
   ============================================================ */

console.log("[MapGen] animate.js loaded");

MapGen.labelRenderer.domElement.style.zIndex = "9999";
MapGen._lastTime = performance.now();

MapGen.animate = function (time) {
  const dt = (time - MapGen._lastTime) / 1000;
  MapGen._lastTime = time;

  MapGen.objects.forEach((entry, id) => {
    if (!entry.targetPos) return;

    // debug once in a while
    if (Math.random() < 0.001) {
      console.log("[MapGen] animating", id, entry.node.position, entry.targetPos);
    }

    entry.node.position.lerp(entry.targetPos, Math.min(1, dt * 6));
  });

  MapGen.labelRenderer.render(MapGen.scene, MapGen.camera);
  requestAnimationFrame(MapGen.animate);
};

// start loop explicitly
MapGen.init();

MapGen.start = function () {
  console.log("[MapGen] animation started");
  requestAnimationFrame(MapGen.animate);
};


