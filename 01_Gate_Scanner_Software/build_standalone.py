"""
Bundles gate_scanner/ui_template.html + attendees.json + photos_b64.json
into a single 100% offline standalone file: BSAA_Gate_Scanner_Standalone.html
that runs directly in Chrome/Safari on Android, iOS, or Windows PC without Python or Wi-Fi.
"""

import os
import json

CUR_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CUR_DIR)

TEMPLATE_PATH = os.path.join(CUR_DIR, "ui_template.html")
ATTENDEES_PATH = os.path.join(CUR_DIR, "attendees.json")
PHOTOS_B64_PATH = os.path.join(CUR_DIR, "photos_b64.json")
OUT_HTML = os.path.join(ROOT_DIR, "BSAA_Gate_Scanner_Standalone.html")


def main():
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        html = f.read()
    with open(ATTENDEES_PATH, "r", encoding="utf-8") as f:
        attendees_raw = f.read()
    with open(PHOTOS_B64_PATH, "r", encoding="utf-8") as f:
        photos_raw = f.read()

    # Validate JSON before embedding
    json.loads(attendees_raw)
    json.loads(photos_raw)

    out_html = (
        html.replace('"__APP_MODE__"', '"standalone"')
        .replace("__EMBEDDED_ATTENDEES__", attendees_raw)
        .replace("__EMBEDDED_PHOTOS__", photos_raw)
    )

    with open(OUT_HTML, "w", encoding="utf-8") as f:
        f.write(out_html)

    size_kb = os.path.getsize(OUT_HTML) / 1024.0
    print(f"Created standalone offline mobile/PC scanner: {OUT_HTML} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
