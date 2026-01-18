log("INIT FILE");
const logo_ascii = "          _____                    _____                    _____                    _____          \r\n         /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\         \r\n        /::\\____\\                /::\\    \\                /::\\____\\                /::\\    \\        \r\n       /::::|   |               /::::\\    \\              /::::|   |               /::::\\    \\       \r\n      /:::::|   |              /::::::\\    \\            /:::::|   |              /::::::\\    \\      \r\n     /::::::|   |             /:::/\\:::\\    \\          /::::::|   |             /:::/\\:::\\    \\     \r\n    /:::/|::|   |            /:::/__\\:::\\    \\        /:::/|::|   |            /:::/__\\:::\\    \\    \r\n   /:::/ |::|   |           /::::\\   \\:::\\    \\      /:::/ |::|   |           /::::\\   \\:::\\    \\   \r\n  /:::/  |::|___|______    /::::::\\   \\:::\\    \\    /:::/  |::|___|______    /::::::\\   \\:::\\    \\  \r\n /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\ ___\\  /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\ ___\\ \r\n/:::/    |:::::::::\\____\\/:::/__\\:::\\   \\:::|    |/:::/    |:::::::::\\____\\/:::/__\\:::\\   \\:::|    |\r\n\\::/    / ~~~~~/:::/    /\\:::\\   \\:::\\  /:::|____|\\::/    / ~~~~~/:::/    /\\:::\\   \\:::\\  /:::|____|\r\n \\/____/      /:::/    /  \\:::\\   \\:::\\/:::/    /  \\/____/      /:::/    /  \\:::\\   \\:::\\/:::/    / \r\n             /:::/    /    \\:::\\   \\::::::/    /               /:::/    /    \\:::\\   \\::::::/    /  \r\n            /:::/    /      \\:::\\   \\::::/    /               /:::/    /      \\:::\\   \\::::/    /   \r\n           /:::/    /        \\:::\\  /:::/    /               /:::/    /        \\:::\\  /:::/    /    \r\n          /:::/    /          \\:::\\/:::/    /               /:::/    /          \\:::\\/:::/    /     \r\n         /:::/    /            \\::::::/    /               /:::/    /            \\::::::/    /      \r\n        /:::/    /              \\::::/    /               /:::/    /              \\::::/    /       \r\n        \\::/    /                \\::/____/                \\::/    /                \\::/____/        \r\n         \\/____/                  ~~                       \\/____/                  ~~              \r\n                                                                                                    ";
log(logo_ascii);
log("[WARN] BOOTING");

(function () {
  async function boot() {
    try {
      window.vars = window.vars || {};

      // 1. Reset DOM safely
      document.open();
      document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Map</title>
</head>
<body>
  <div id="mapgen-root"></div>
</body>
</html>
      `);
      document.close();

      // 2. Load Three.js as module
      const THREE = await import(
        "https://theredmineword.github.io/map/build/scripts/cdn.jsdelivr.net/three.module.js"
      );

      const { CSS2DRenderer, CSS2DObject } = await import(
        "https://theredmineword.github.io/map/build/scripts/cdn.jsdelivr.net/CSS2DRenderer.js"
      );

      // 3. Bridge to global scope
      window.THREE = THREE;
      window.THREE.CSS2DRenderer = CSS2DRenderer;
      window.THREE.CSS2DObject = CSS2DObject;

      // 4. Eval injected source ONCE, AFTER THREE exists
      if (typeof window.vars.JAVASCRIPT_SOURCE === "string") {
        eval(window.vars.JAVASCRIPT_SOURCE);
      } else {
        console.warn("[BOOT] JAVASCRIPT_SOURCE missing");
      }

    } catch (err) {
      console.error("[BOOT] Failed:", err);
    }
  }

  // wait 1 second
  setTimeout(boot, 1000);
})();
