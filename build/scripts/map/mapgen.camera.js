MapGen.focus = function () {
  if (!MapGen.objects.size) return;

  const box = new THREE.Box3();
  MapGen.objects.forEach(e => box.expandByPoint(e.targetPos));

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();

  MapGen.camera.position.set(
    center.x,
    center.y,
    center.z + size * 1.2
  );

  MapGen.camera.lookAt(center);
};




MapGen._onResize = function () {
  console.log("[MapGen] resize");
  MapGen.camera.aspect = window.innerWidth / window.innerHeight;
  MapGen.camera.updateProjectionMatrix();
  MapGen.labelRenderer.setSize(window.innerWidth, window.innerHeight);
};
