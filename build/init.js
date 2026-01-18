log("INIT FILE");
const logo_ascii = "          _____                    _____                    _____                    _____          \r\n         /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\         \r\n        /::\\____\\                /::\\    \\                /::\\____\\                /::\\    \\        \r\n       /::::|   |               /::::\\    \\              /::::|   |               /::::\\    \\       \r\n      /:::::|   |              /::::::\\    \\            /:::::|   |              /::::::\\    \\      \r\n     /::::::|   |             /:::/\\:::\\    \\          /::::::|   |             /:::/\\:::\\    \\     \r\n    /:::/|::|   |            /:::/__\\:::\\    \\        /:::/|::|   |            /:::/__\\:::\\    \\    \r\n   /:::/ |::|   |           /::::\\   \\:::\\    \\      /:::/ |::|   |           /::::\\   \\:::\\    \\   \r\n  /:::/  |::|___|______    /::::::\\   \\:::\\    \\    /:::/  |::|___|______    /::::::\\   \\:::\\    \\  \r\n /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\ ___\\  /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\ ___\\ \r\n/:::/    |:::::::::\\____\\/:::/__\\:::\\   \\:::|    |/:::/    |:::::::::\\____\\/:::/__\\:::\\   \\:::|    |\r\n\\::/    / ~~~~~/:::/    /\\:::\\   \\:::\\  /:::|____|\\::/    / ~~~~~/:::/    /\\:::\\   \\:::\\  /:::|____|\r\n \\/____/      /:::/    /  \\:::\\   \\:::\\/:::/    /  \\/____/      /:::/    /  \\:::\\   \\:::\\/:::/    / \r\n             /:::/    /    \\:::\\   \\::::::/    /               /:::/    /    \\:::\\   \\::::::/    /  \r\n            /:::/    /      \\:::\\   \\::::/    /               /:::/    /      \\:::\\   \\::::/    /   \r\n           /:::/    /        \\:::\\  /:::/    /               /:::/    /        \\:::\\  /:::/    /    \r\n          /:::/    /          \\:::\\/:::/    /               /:::/    /          \\:::\\/:::/    /     \r\n         /:::/    /            \\::::::/    /               /:::/    /            \\::::::/    /      \r\n        /:::/    /              \\::::/    /               /:::/    /              \\::::/    /       \r\n        \\::/    /                \\::/____/                \\::/    /                \\::/____/        \r\n         \\/____/                  ~~                       \\/____/                  ~~              \r\n                                                                                                    ";
log(logo_ascii);
log("[WARN] BOOTING");

// 1. Create and insert importmap script
const importMapScript = document.createElement('script');
importMapScript.type = 'importmap';
importMapScript.textContent = JSON.stringify({
  imports: {
    "three": "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/"
  }
});
document.body.appendChild(importMapScript);

// 2. Create and insert the module script with your code
const moduleScript = document.createElement('script');
moduleScript.type = 'module';

const moduleCode = `
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
`;

moduleScript.textContent = moduleCode;
document.body.appendChild(moduleScript);

 // 5. Run your custom source if present
    if (typeof window.vars.JAVASCRIPT_SOURCE === "string") {
      new Function(window.vars.JAVASCRIPT_SOURCE)();
    } else {
      console.warn("[BOOT] JAVASCRIPT_SOURCE missing");
    }

