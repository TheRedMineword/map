// ==== ::= MapGen Search & Core Jump (separated) =:: ==== //

// 1️⃣ Function to jump camera to core star
function jumpToCore() {
  const coreEntry = Array.from(MapGen.objects.values()).find(e => e.obj.meta.id === "core");
  if (!coreEntry) {
    console.warn("[MapGen] No object with id 'core' found");
    return;
  }

  const cam = MapGen.camera;
  const startPos = cam.position.clone();
  const targetPos = coreEntry.targetPos.clone().add(new THREE.Vector3(0,0,200));
  const startTime = performance.now();

  function animateCamera(time) {
    const t = Math.min((time - startTime) / 1000, 1); // 1 second
    cam.position.lerpVectors(startPos, targetPos, t);
    cam.lookAt(coreEntry.targetPos);
    if (t < 1) requestAnimationFrame(animateCamera);
    else console.log("[MapGen] Jumped to core:", coreEntry.obj.meta.id, coreEntry.obj.meta.displayName);
  }
  requestAnimationFrame(animateCamera);
}

// 2️⃣ Function to initialize search bar and navigation
function searchBarStart() {
  if (window._mapgenSearchUIInitialized) return;
  window._mapgenSearchUIInitialized = true;

  // Create search input
  const searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.placeholder = "Search star by ID or name...";
  Object.assign(searchBar.style, {
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "300px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    zIndex: "10001",
    fontSize: "14px",
    outline: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  });
  document.body.appendChild(searchBar);

  // Create nav bar
  const navBar = document.createElement("div");
  Object.assign(navBar.style, {
    position: "absolute",
    top: "50px",
    left: "50%",
    transform: "translateX(-50%)",
    fontFamily: "sans-serif",
    color: "white",
    fontSize: "14px",
    background: "rgba(0,0,0,0.4)",
    padding: "4px 8px",
    borderRadius: "6px",
    zIndex: "10001",
    userSelect: "none",
  });
  navBar.innerHTML = `<< nulloffound__Inactive >>`;
  document.body.appendChild(navBar);

  let searchResults = [];
  let currentIndex = 0;

  function updateNavBar() {
    if (!searchResults.length) navBar.innerHTML = `<< nulloffound__Inactive >>`;
    else navBar.innerHTML = `<< ${currentIndex+1}/${searchResults.length} >>`;
  }

  function moveCameraToEntry(entry, duration = 0.8) {
    if (!entry) return;
    const cam = MapGen.camera;
    const startPos = cam.position.clone();
    const targetPos = entry.targetPos.clone().add(new THREE.Vector3(0,0,200));
    const startTime = performance.now();

    function animateCamera(time) {
      const t = Math.min((time - startTime) / (duration*1000), 1);
      cam.position.lerpVectors(startPos, targetPos, t);
      cam.lookAt(entry.targetPos);
      if (t < 1) requestAnimationFrame(animateCamera);
      else console.log("[MapGen] Moved to:", entry.obj.meta.id, entry.obj.meta.displayName);
    }
    requestAnimationFrame(animateCamera);
  }

  function performSearch(query) {
    const lowerQuery = query.toLowerCase();
    searchResults = Array.from(MapGen.objects.values()).filter(e => {
      const id = e.obj.meta.id || "";
      const name = e.obj.meta.displayName || "";
      return id.toLowerCase().includes(lowerQuery) || name.toLowerCase().includes(lowerQuery);
    });
    currentIndex = 0;
    updateNavBar();
    if (searchResults.length > 0) moveCameraToEntry(searchResults[currentIndex]);
    else console.warn("[MapGen] No matches for:", query);
  }

  // Search input
  searchBar.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const query = searchBar.value.trim();
      if (!query) {
        searchResults = [];
        currentIndex = 0;
        updateNavBar();
        return;
      }
      performSearch(query);
    }
  });

  // Nav bar click
  navBar.addEventListener("click", e => {
    if (!searchResults.length) return;
    const rect = navBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    if (x < width/2) currentIndex = (currentIndex - 1 + searchResults.length) % searchResults.length;
    else currentIndex = (currentIndex + 1) % searchResults.length;
    moveCameraToEntry(searchResults[currentIndex]);
    updateNavBar();
    console.log("[MapGen] Navigated to:", searchResults[currentIndex].obj.meta.id, searchResults[currentIndex].obj.meta.displayName);
  });

  console.log("[MapGen] searchBarStart() initialized");
}
