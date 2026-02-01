// KEEP IT LAST //

MapGen.pushBlob = function (blob, chunkSize = 50) {
  let i = 0;

  function next() {
    const end = Math.min(i + chunkSize, blob.length);
    for (; i < end; i++) {
      const decoded = JSON.parse(blob[i]);
const items = Array.isArray(decoded) ? decoded : [decoded];
items.forEach(MapGen.push);

    }

    if (i < blob.length) {
      requestAnimationFrame(next);
    }
  }

  next();
};




// INIT //
//temponary?// MapGen.start();
// MapGen.init();
//temponary?// MapGen.pushBlob(window.vars.MAP_BLOB);
//temponary?// MapGen.focus();
//temponary?// console.log("[CAMERA]: MapGen.focus();");




//(function loop() {
//  MapGen.animate();
//  requestAnimationFrame(loop);
//})();





console.log("[DAS INIT REAL1!!11!!]: We all gonna die");
console.log("MapGen.init(document.getElementById("mapgen-root"));\nMapGen.start();\nMapGen.pushBlob(window.vars.MAP_BLOB);\nMapGen.focus();");

MapGen.init(document.getElementById("mapgen-root"));
MapGen.start();
MapGen.pushBlob(window.vars.MAP_BLOB);
MapGen.focus();

