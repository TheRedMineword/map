log("INIT FILE");
const logo_ascii = "          _____                    _____                    _____                    _____          \r\n         /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\         \r\n        /::\\____\\                /::\\    \\                /::\\____\\                /::\\    \\        \r\n       /::::|   |               /::::\\    \\              /::::|   |               /::::\\    \\       \r\n      /:::::|   |              /::::::\\    \\            /:::::|   |              /::::::\\    \\      \r\n     /::::::|   |             /:::/\\:::\\    \\          /::::::|   |             /:::/\\:::\\    \\     \r\n    /:::/|::|   |            /:::/__\\:::\\    \\        /:::/|::|   |            /:::/__\\:::\\    \\    \r\n   /:::/ |::|   |           /::::\\   \\:::\\    \\      /:::/ |::|   |           /::::\\   \\:::\\    \\   \r\n  /:::/  |::|___|______    /::::::\\   \\:::\\    \\    /:::/  |::|___|______    /::::::\\   \\:::\\    \\  \r\n /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\ ___\\  /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\ ___\\ \r\n/:::/    |:::::::::\\____\\/:::/__\\:::\\   \\:::|    |/:::/    |:::::::::\\____\\/:::/__\\:::\\   \\:::|    |\r\n\\::/    / ~~~~~/:::/    /\\:::\\   \\:::\\  /:::|____|\\::/    / ~~~~~/:::/    /\\:::\\   \\:::\\  /:::|____|\r\n \\/____/      /:::/    /  \\:::\\   \\:::\\/:::/    /  \\/____/      /:::/    /  \\:::\\   \\:::\\/:::/    / \r\n             /:::/    /    \\:::\\   \\::::::/    /               /:::/    /    \\:::\\   \\::::::/    /  \r\n            /:::/    /      \\:::\\   \\::::/    /               /:::/    /      \\:::\\   \\::::/    /   \r\n           /:::/    /        \\:::\\  /:::/    /               /:::/    /        \\:::\\  /:::/    /    \r\n          /:::/    /          \\:::\\/:::/    /               /:::/    /          \\:::\\/:::/    /     \r\n         /:::/    /            \\::::::/    /               /:::/    /            \\::::::/    /      \r\n        /:::/    /              \\::::/    /               /:::/    /              \\::::/    /       \r\n        \\::/    /                \\::/____/                \\::/    /                \\::/____/        \r\n         \\/____/                  ~~                       \\/____/                  ~~              \r\n                                                                                                    ";
log(logo_ascii);
log("[WARN] BOOTING");






async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

(async () => {
  // Load Three.js
  await loadScript('https://cdn.jsdelivr.net/npm/three@0.131.1/build/three.min.js');

  // Load CSS2DRenderer
  await loadScript('https://cdn.jsdelivr.net/npm/three@0.131.1/examples/js/renderers/CSS2DRenderer.js');

  // Define CSS2DRenderer manually
  const CSS2DRenderer = THREE.CSS2DRenderer;

  // Now it works
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(labelRenderer.domElement);

  console.log('CSS2DRenderer is ready:', CSS2DRenderer);
})();
  if (typeof window.vars.JAVASCRIPT_SOURCE === "string") {
    eval(window.vars.JAVASCRIPT_SOURCE);
  }
