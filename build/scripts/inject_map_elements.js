// KEEP IT LAST //

MapGen.pushBlob = function (blob, chunkSize = 50) {
  let i = 0;

  function next() {
    const end = Math.min(i + chunkSize, blob.length);
    for (; i < end; i++) {
      const decoded = JSON.parse(blob[i]);
      decoded.forEach(MapGen.push);
    }

    if (i < blob.length) {
      requestAnimationFrame(next);
    }
  }

  next();
};




// INIT //

MapGen.init();
MapGen.pushBlob(window.vars.MAP_BLOB);
(function loop() {
  MapGen.render();
  requestAnimationFrame(loop);
})();
