const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PORT = 8080;

let totalRequests = 0;

/* =========================
   LOAD ENV REPLACEMENTS
========================= */

function applyEnvReplacements(text) {

  const envPath = path.join(ROOT, "replace.env");

  if (!fs.existsSync(envPath)) {
    console.log("No replace.env found");
    return text;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  let result = text;

  console.log("Applying ENV replacements...");

  lines.forEach((line, index) => {

    if (!line.trim()) return;

    const eqIndex = line.indexOf("=");

    if (eqIndex === -1) {
      console.log(`Skipping invalid line ${index + 1}: ${line}`);
      return;
    }

    const key = line.slice(0, eqIndex);
    const value = line.slice(eqIndex + 1);

    console.log(`  [${index + 1}] Replace: "${key}" → "${value}"`);

    result = result.split(key).join(value);

  });

  return result;
}

/* =========================
   BINARY CHECK
========================= */

function isBinary(filePath) {

  const textExtensions = [
    ".html",".js",".css",".json",".txt",".md",".svg",
    ".xml",".csv",".env"
  ];

  const ext = path.extname(filePath).toLowerCase();

  return !textExtensions.includes(ext);
}

/* =========================
   RESOLVE PATH
========================= */

function resolveFile(urlPath) {

  let clean = decodeURIComponent(urlPath.split("?")[0]);

  if (clean === "/") clean = "/index.html";

  let fullPath = path.join(ROOT, clean);

  console.log("Resolving:", clean);
  console.log("Initial path:", fullPath);

  // If directory → index.html
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    fullPath = path.join(fullPath, "index.html");
    console.log("Directory detected →", fullPath);
  }

  // Try .html fallback
  if (!fs.existsSync(fullPath) && fs.existsSync(fullPath + ".html")) {
    fullPath = fullPath + ".html";
    console.log(".html fallback →", fullPath);
  }

  return fullPath;
}

/* =========================
   SERVER
========================= */

const server = http.createServer((req, res) => {

  totalRequests++;

  console.log("\n=============================");
  console.log("REQUEST #" + totalRequests);
  console.log("Time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", req.headers);

  try {

    const filePath = resolveFile(req.url);

    console.log("Final resolved path:", filePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {

      console.log("File FOUND → Serving");

      if (!isBinary(filePath)) {

        console.log("Text file detected → applying replacements");

        let data = fs.readFileSync(filePath, "utf8");

        data = applyEnvReplacements(data);

        res.statusCode = 200;
        res.end(data);

      } else {

        console.log("Binary file detected → streaming raw");

        res.statusCode = 200;
        fs.createReadStream(filePath).pipe(res);
      }

      return;
    }

    /* ===== 404 fallback ===== */

    const notFoundPath = path.join(ROOT, "404.html");

    if (fs.existsSync(notFoundPath)) {

      console.log("File NOT FOUND → serving 404.html");

      res.statusCode = 404;
      fs.createReadStream(notFoundPath).pipe(res);

    } else {

      console.log("File NOT FOUND → sending default 404");

      res.statusCode = 404;
      res.end("404 Not Found");
    }

  } catch (err) {

    console.error("SERVER ERROR:");
    console.error(err);

    res.statusCode = 502;
    res.end("502 Bad Gateway");
  }

});

server.listen(PORT, () => {
  console.log("=================================");
  console.log("Server started");
  console.log("Root:", ROOT);
  console.log("URL: http://localhost:" + PORT);
  console.log("=================================");
});