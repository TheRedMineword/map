(async () => {
  const BASE64_INPUT = "$$PLACEHOLDER$$";

  function b64ToU8(b64) {
    const s = atob(b64);
    const u = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
    return u;
  }

  function u8ToB64(u8) {
    let s = "";
    for (const b of u8) s += String.fromCharCode(b);
    return btoa(s);
  }

  const input = b64ToU8(BASE64_INPUT);
  console.log("input_bytes:", input.length);

  const cs = new CompressionStream("gzip");
  cs.writable.getWriter().write(input).then(w => w?.close?.());

  const compressed = new Uint8Array(
    await new Response(cs.readable).arrayBuffer()
  );

  console.log("compressed_bytes:", compressed.length);

  return {
    encoding: "base64",
    compression: "gzip",
    ratio: (compressed.length / input.length).toFixed(3),
    data: u8ToB64(compressed)
  };
})();
