import json
import base64
import sys

def encode_to_data_uri(obj):
    json_str = json.dumps(obj, separators=(",", ":"), ensure_ascii=False)
    b64 = base64.b64encode(json_str.encode("utf-8")).decode("ascii")
    return f"data:application/json;base64,{b64}"

def process_elements(input_file, output_file):
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("Input JSON must be an array")

    output = []

    for item in data:
        if isinstance(item, str):
            # leave ALL strings untouched
            output.append(item)
        else:
            # encode objects (dict, list, etc.)
            output.append(encode_to_data_uri(item))

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, separators=(",", ":"), ensure_ascii=False)

    print("OK:", output_file)


if __name__ == "__main__":
    process_elements(sys.argv[1], sys.argv[2])