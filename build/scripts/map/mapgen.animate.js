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
 //    console,log("a");
    return;
  }

  if (MapGen.webglRenderer) {
    MapGen.webglRenderer.render(MapGen.scene, MapGen.camera);
 //    console,log("b");
  }

  if (MapGen.labelRenderer) {
    MapGen.labelRenderer.render(MapGen.scene, MapGen.camera);
//     console.log("c");
  }

   MapGen.objects.forEach(entry => {
  entry.node.position.copy(entry.targetPos);
});


//try {
//  MapGen._resolveLabelOverlap();
//} catch (err) {
  //console.warn("[MapGen] label overlap resolver failed", err);
//}
   
const delta = (time - MapGen._lastTime) / 1000;
MapGen._lastTime = time;

MapGen._updateCameraMovement(delta);

     // 🔥 DUMP LOGIC
  MapGen.maybeDump(time);
  requestAnimationFrame(MapGen.animate);
//   console.log("d");
   //console.count("frame");

};




// start loop explicitly
// MapGen.init();
//temponary?// MapGen.init(root);



MapGen.start = function () {
  if (!MapGen._ready || MapGen._started) return;

  MapGen._started = true;
  requestAnimationFrame(MapGen.animate);
};






//temponary?// MapGen.start();















