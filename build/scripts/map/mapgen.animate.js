/* ============================================================
   MAPGEN.ANIMATE.JS
   Render loop + smoothing
   ============================================================ */

console.log("[MapGen] animate.js loaded");

// MapGen.labelRenderer.domElement.style.zIndex = "9999";
MapGen._lastTime = performance.now();

MapGen.animate = function (time) {
  const dt = (time - MapGen._lastTime) / 1000;
  MapGen._lastTime = time;

  MapGen.objects.forEach((entry) => {
    if (!entry.targetPos) return;
    entry.node.position.lerp(entry.targetPos, Math.min(1, dt * 6));
  });

  // THIS is what fixes everything
  MapGen.webglRenderer.render(MapGen.scene, MapGen.camera);

  MapGen.labelRenderer.render(MapGen.scene, MapGen.camera);

  requestAnimationFrame(MapGen.animate);
};


// start loop explicitly
// MapGen.init();
MapGen.init(root);



MapGen.start = function () {
  console.log("[MapGen] animation started");
  requestAnimationFrame(MapGen.animate);
};



MapGen.start();


