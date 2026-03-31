import json
import requests
import subprocess
from pathlib import Path

CONFIG_FILE = './config.json'
TEMP_SCRIPT_FILE = './temp_script.js'
OUTPUT_JSON_FILE = './elements.json'

def load_config():
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def fetch_url(url):
    print(f"Fetching: {url}")
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.text

def main():
    # 1. Load local config
    config = load_config()
    script_info = config.get("script")
    if not script_info:
        raise ValueError("Config must contain 'script' key")

    script_url = script_info.get("scriptURL")
    replace_items = script_info.get("replace", [])

    # 2. Fetch JS script
    script_content = fetch_url(script_url)
    print(f"Original script length: {len(script_content)}")

    # 3. Perform replacements
    for item in replace_items:
        key = item.get("key")
        content_url = item.get("content")
        if key and content_url:
            replacement_text = fetch_url(content_url)
            print(f"Replacing key '{key}' with content length {len(replacement_text)}")
            script_content = script_content.replace(key, replacement_text)

    # 4. Comment out all console.log except final output
    # This replaces "console.log(" with "//console.log(" in the script
    script_content = script_content.replace("console.log(", "//console.log(")

    # 5. Ensure JS returns JSON directly
    # Append final JSON write if not already present
    wrapper = "\nprocess.stdout.write(JSON.stringify(finalOutput, null, 2));\n"
    if "const finalOutput = run();" in script_content:
        script_content = script_content.replace(
            "const finalOutput = run();",
            "const finalOutput = run();" + wrapper
        )
    else:
        script_content += wrapper

    # 6. Save temporary JS
    Path(TEMP_SCRIPT_FILE).write_text(script_content, encoding='utf-8')
    print(f"Temporary JS saved: {TEMP_SCRIPT_FILE}")

    # 7. Run Node.js script and capture output
    print("Executing JS to generate JSON output...")
    result = subprocess.run(
        ["node", TEMP_SCRIPT_FILE],
        capture_output=True,
        text=True,
        encoding='utf-8',
        check=True
    )

    # 8. Parse JSON output
    try:
        output_json = json.loads(result.stdout)
    except json.JSONDecodeError as e:
        print("⚠️ JSON decoding failed:", e)
        output_json = {"raw_output": result.stdout}

    # 9. Save to elements.json
    with open(OUTPUT_JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_json, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Final elements.json written: {OUTPUT_JSON_FILE}")
    print(f"Output length: {len(result.stdout)} characters")

if __name__ == "__main__":
    main()