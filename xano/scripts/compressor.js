(() => {
  const BASE64_INPUT = "$$PLACEHOLDER$$";

  const bin = atob(BASE64_INPUT);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }

  // Optional light log (sizes only)
  console.log("decoded_bytes:", bytes.length);

  let out = "";
  for (const b of bytes) out += String.fromCharCode(b);

  return {
    encoding: "base64",
    compression: "none",
    size: bytes.length,
    data: btoa(out)
  };
})();
