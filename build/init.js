log("INIT FILE");
const logo_ascii = "          _____                    _____                    _____                    _____          \r\n         /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\         \r\n        /::\\____\\                /::\\    \\                /::\\____\\                /::\\    \\        \r\n       /::::|   |               /::::\\    \\              /::::|   |               /::::\\    \\       \r\n      /:::::|   |              /::::::\\    \\            /:::::|   |              /::::::\\    \\      \r\n     /::::::|   |             /:::/\\:::\\    \\          /::::::|   |             /:::/\\:::\\    \\     \r\n    /:::/|::|   |            /:::/__\\:::\\    \\        /:::/|::|   |            /:::/__\\:::\\    \\    \r\n   /:::/ |::|   |           /::::\\   \\:::\\    \\      /:::/ |::|   |           /::::\\   \\:::\\    \\   \r\n  /:::/  |::|___|______    /::::::\\   \\:::\\    \\    /:::/  |::|___|______    /::::::\\   \\:::\\    \\  \r\n /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\ ___\\  /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\ ___\\ \r\n/:::/    |:::::::::\\____\\/:::/__\\:::\\   \\:::|    |/:::/    |:::::::::\\____\\/:::/__\\:::\\   \\:::|    |\r\n\\::/    / ~~~~~/:::/    /\\:::\\   \\:::\\  /:::|____|\\::/    / ~~~~~/:::/    /\\:::\\   \\:::\\  /:::|____|\r\n \\/____/      /:::/    /  \\:::\\   \\:::\\/:::/    /  \\/____/      /:::/    /  \\:::\\   \\:::\\/:::/    / \r\n             /:::/    /    \\:::\\   \\::::::/    /               /:::/    /    \\:::\\   \\::::::/    /  \r\n            /:::/    /      \\:::\\   \\::::/    /               /:::/    /      \\:::\\   \\::::/    /   \r\n           /:::/    /        \\:::\\  /:::/    /               /:::/    /        \\:::\\  /:::/    /    \r\n          /:::/    /          \\:::\\/:::/    /               /:::/    /          \\:::\\/:::/    /     \r\n         /:::/    /            \\::::::/    /               /:::/    /            \\::::::/    /      \r\n        /:::/    /              \\::::/    /               /:::/    /              \\::::/    /       \r\n        \\::/    /                \\::/____/                \\::/    /                \\::/____/        \r\n         \\/____/                  ~~                       \\/____/                  ~~              \r\n                                                                                                    ";
log(logo_ascii);
log("[WARN] BOOTING");

(function () {
  function boot() {
    try {
      // 1. Ensure vars exists
      window.vars = window.vars || {};

      // 2. Set page source (minimal required DOM)
      document.documentElement.innerHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Map</title>
</head>
<body>
  <div id="mapgen-root"></div>
</body>
<script type="module">
(async () => {
  // wait 1s as requested
  await new Promise(r => setTimeout(r, 1000));

  // load THREE
  const THREE = await import(
    "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js"
  );

  const { CSS2DRenderer, CSS2DObject } = await import(
    "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/renderers/CSS2DRenderer.js"
  );

  // expose globally (THIS is the missing piece)
  window.THREE = THREE;
  window.THREE.CSS2DRenderer = CSS2DRenderer;
  window.THREE.CSS2DObject = CSS2DObject;

  // ensure vars
  window.vars = window.vars || {};

  // eval your injected source
  if (typeof window.vars.JAVASCRIPT_SOURCE === "string") {
    eval(window.vars.JAVASCRIPT_SOURCE);
  } else {
    console.warn("[BOOT] JAVASCRIPT_SOURCE missing");
  }
})();
</script>
</html>
      `;

      // 3. Eval injected JS
      if (typeof window.vars.JAVASCRIPT_SOURCE === "string") {
        eval(window.vars.JAVASCRIPT_SOURCE);
      } else {
        console.warn("[BOOT] JAVASCRIPT_SOURCE missing or not a string");
      }

    } catch (err) {
      console.error("[BOOT] Failed:", err);
    }
  }

  // wait 1 second
  setTimeout(boot, 1000);
})();
