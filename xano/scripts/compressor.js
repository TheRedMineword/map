const { Buffer } = await import("npm:buffer");
const zlib = await import("node:zlib");

try {
  // 1. Validate Input
  if (typeof $var.target !== 'string') {
    throw new Error("$var.target must be a Base64 encoded string.");
  }

  // 2. Decode the Base64 input string into a binary Buffer
  // This handles JSON, text, or raw binary data encoded in the input string.
  const decodedBuffer = Buffer.from($var.target, 'base64');
  const inputLength = decodedBuffer.length;

  // 3. Compress the data
  // We use Gzip with Z_BEST_COMPRESSION (Level 9) to achieve the smallest file size
  // compatible with standard Gzip tools.
  const compressedBuffer = zlib.gzipSync(decodedBuffer, {
    level: zlib.constants.Z_BEST_COMPRESSION
  });
  const outputLength = compressedBuffer.length;

  // 4. Encode the compressed binary back to Base64
  // JSON cannot natively hold raw binary data, so Base64 is required to return it safely.
  const outputBase64 = compressedBuffer.toString('base64');

  // 5. Return the result
  return {
    success: true,
    compressed_data: outputBase64,
    stats: {
      input_length_bytes: inputLength,
      output_length_bytes: outputLength,
      compression_ratio: (100 * (1 - outputLength / inputLength)).toFixed(2) + "%",
      method: "gzip"
    }
  };

} catch (e) {
  return {
    success: false,
    error: e.message
  };
}
