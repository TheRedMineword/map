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









MapGen.controls = {
  moveSpeed: 1200,
  zoomSpeed: 0.1,
  dragSpeed: 1,
  minZ: 200,
  maxZ: 10000,

  keys: {},
  isDragging: false,
  lastMouse: { x: 0, y: 0 }
};




window.addEventListener("keydown", e => {
  MapGen.controls.keys[e.code] = true;
});

window.addEventListener("keyup", e => {
  MapGen.controls.keys[e.code] = false;
});


const canvas = MapGen.webglRenderer?.domElement || window;

canvas.addEventListener("mousedown", e => {
  MapGen.controls.isDragging = true;
  MapGen.controls.lastMouse.x = e.clientX;
  MapGen.controls.lastMouse.y = e.clientY;
});

window.addEventListener("mouseup", () => {
  MapGen.controls.isDragging = false;
});

window.addEventListener("mousemove", e => {
  if (!MapGen.controls.isDragging) return;

  const dx = e.clientX - MapGen.controls.lastMouse.x;
  const dy = e.clientY - MapGen.controls.lastMouse.y;

  const cam = MapGen.camera;
  const scale = cam.position.z * 0.001;

  cam.position.x -= dx * scale * MapGen.controls.dragSpeed;
  cam.position.y += dy * scale * MapGen.controls.dragSpeed;

  MapGen.controls.lastMouse.x = e.clientX;
  MapGen.controls.lastMouse.y = e.clientY;
});


canvas.addEventListener("wheel", e => {
  e.preventDefault();

  const cam = MapGen.camera;
  const zoomFactor = 1.1;

  if (e.deltaY < 0) {
    cam.position.z /= zoomFactor;
  } else {
    cam.position.z *= zoomFactor;
  }

  cam.position.z = Math.min(
    MapGen.controls.maxZ,
    Math.max(MapGen.controls.minZ, cam.position.z)
  );
}, { passive: false });



MapGen._updateCameraMovement = function(delta) {
  const c = MapGen.controls;
  const cam = MapGen.camera;
  const speed = c.moveSpeed * delta * (cam.position.z * 0.001);

  if (c.keys["KeyW"] || c.keys["ArrowUp"]) cam.position.y += speed;
  if (c.keys["KeyS"] || c.keys["ArrowDown"]) cam.position.y -= speed;
  if (c.keys["KeyA"] || c.keys["ArrowLeft"]) cam.position.x -= speed;
  if (c.keys["KeyD"] || c.keys["ArrowRight"]) cam.position.x += speed;
};
