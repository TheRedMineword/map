// ---- INPUT (hard coded or replace with $input.xxx) ----
const BASE64_INPUT = "$$PLACEHOLDER$$";

// ---- Base64 → Uint8Array ----
function base64ToUint8Array(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

// ---- Uint8Array → Base64 ----
function uint8ArrayToBase64(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

// ---- Compress using gzip ----
async function gzipCompress(uint8) {
  const cs = new CompressionStream("gzip");
  const writer = cs.writable.getWriter();
  await writer.write(uint8);
  await writer.close();

  const compressed = await new Response(cs.readable).arrayBuffer();
  return new Uint8Array(compressed);
}

// ---- Pipeline ----
const decoded = base64ToUint8Array(BASE64_INPUT);
const compressed = await gzipCompress(decoded);
const compressedBase64 = uint8ArrayToBase64(compressed);

// ---- Output (Base64-encoded JSON-safe blob) ----
const return = {
  encoding: "base64",
  compression: "gzip",
  data: compressedBase64,
  original_size: decoded.length,
  compressed_size: compressed.length
};

return
