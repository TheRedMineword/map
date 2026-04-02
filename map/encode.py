import json
import gzip
import sys

def process_file(input_file, output_file):
    print(f"[INFO] Reading: {input_file}")

    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    print("[INFO] Minifying JSON...")
    json_bytes = json.dumps(
        data,
        separators=(",", ":"),  # removes whitespace
        ensure_ascii=False
    ).encode("utf-8")

    print(f"[DEBUG] Minified size: {len(json_bytes)} bytes")

    print("[INFO] Compressing with gzip...")
    compressed = gzip.compress(json_bytes, compresslevel=9)

    print(f"[DEBUG] Compressed size: {len(compressed)} bytes")

    print(f"[INFO] Writing: {output_file}")
    with open(output_file, "wb") as f:
        f.write(compressed)

    print("[SUCCESS] Done")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py input.json output.bin")
        sys.exit(1)

    process_file(sys.argv[1], sys.argv[2])