"""
Builds optimized web assets and attendee database for the BSAA Gate Scanner Software.
Reads BSAA_Final_Updated.xlsx and extracts clean face-centered portrait thumbnails
from downloaded_photos/ (supporting JPEG, PNG, HEIC, and CamScanner PDFs).
"""

import os
import sys
import json
import base64
from io import BytesIO
import openpyxl
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageEnhance

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)

import generate_id_cards as gen

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
PHOTOS_DIR = os.path.join(OUT_DIR, "static", "photos")
ATTENDEES_JSON = os.path.join(OUT_DIR, "attendees.json")
EXCEL_PATH = os.path.join(ROOT_DIR, "BSAA_Final_Updated.xlsx")

THUMB_SIZE = (180, 225)
EMBED_SIZE = (100, 125)


def make_thumbnail_bytes(photo_url, size=THUMB_SIZE, quality=80):
    """Extracts and crops a clean portrait thumbnail; returns None if no photo."""
    if not photo_url:
        return None
    import re
    m = re.search(r"id=([a-zA-Z0-9_-]+)", str(photo_url))
    fid = m.group(1) if m else None
    if not fid:
        m2 = re.search(r"/d/([a-zA-Z0-9_-]+)", str(photo_url))
        fid = m2.group(1) if m2 else None
    if not fid:
        return None

    p_path = os.path.join(gen.PHOTO_CACHE_DIR, f"{fid}.jpg")
    raw_img = gen.load_cached_raw_photo(p_path)
    if raw_img is None:
        return None

    # Use YuNet face-centered crop from generate_id_cards
    processed, has_photo = gen.process_attendee_photo(photo_url)
    if not has_photo:
        return None

    thumb = processed.resize(size, Image.Resampling.LANCZOS)
    buf = BytesIO()
    thumb.save(buf, format="JPEG", quality=quality, optimize=True)
    return buf.getvalue()


def main():
    os.makedirs(PHOTOS_DIR, exist_ok=True)
    if not os.path.exists(EXCEL_PATH):
        raise FileNotFoundError(f"Excel file not found: {EXCEL_PATH}")

    print(f"Reading attendees from {EXCEL_PATH}...")
    wb = openpyxl.load_workbook(EXCEL_PATH)
    ws = wb.active

    attendees = []
    photo_b64_map = {}

    for r in range(2, ws.max_row + 1):
        sl = ws.cell(r, 1).value
        if sl is None:
            continue

        sl_num = int(sl)
        family_id = f"BSAA {sl_num:03d}"
        company = str(ws.cell(r, 2).value or "").strip()
        part_name = str(ws.cell(r, 3).value or "").strip()
        part_serial = str(ws.cell(r, 4).value or "").strip()
        email = str(ws.cell(r, 5).value or "").strip()
        desig = str(ws.cell(r, 6).value or "").strip()
        phone = gen.format_mobile(ws.cell(r, 7).value)
        part_photo = ws.cell(r, 8).value

        if not part_name or not part_serial:
            continue

        # Helper to append attendee
        def add_person(serial, name, role, relation_or_desig, photo_url):
            safe_ser = serial.replace(" ", "_")
            thumb_name = f"{safe_ser}.jpg"
            thumb_path = os.path.join(PHOTOS_DIR, thumb_name)

            # Reuse photo processing once per person
            has_img = False
            if photo_url:
                processed, ok = gen.process_attendee_photo(photo_url)
                if ok:
                    has_img = True
                    # High-res thumbnail for server
                    t_img = processed.resize(THUMB_SIZE, Image.Resampling.LANCZOS)
                    t_img.save(thumb_path, format="JPEG", quality=82, optimize=True)

                    # Compact base64 thumbnail for standalone offline mobile/PC HTML
                    e_img = processed.resize(EMBED_SIZE, Image.Resampling.LANCZOS)
                    ebuf = BytesIO()
                    e_img.save(ebuf, format="JPEG", quality=68, optimize=True)
                    photo_b64_map[serial] = "data:image/jpeg;base64," + base64.b64encode(ebuf.getvalue()).decode("ascii")

            attendees.append({
                "sl": sl_num,
                "family_id": family_id,
                "serial": serial,
                "serial_compact": serial.replace(" ", "").upper(),
                "name": name,
                "role": role,
                "designation": relation_or_desig,
                "company": company,
                "phone": phone,
                "email": email,
                "photo": thumb_name if has_img else None,
            })

        # 1. Main Participant
        add_person(part_serial, part_name, "Participant", desig, part_photo)

        # 2. Spouse
        spouse_name = ws.cell(r, 9).value
        spouse_serial = ws.cell(r, 10).value
        spouse_photo = ws.cell(r, 11).value
        if spouse_name and str(spouse_name).strip() and spouse_serial:
            s_name = str(spouse_name).strip()
            s_ser = str(spouse_serial).strip()
            if s_name.lower() not in ["n/a", "na", "nil", "none", "no more", "test"]:
                add_person(s_ser, s_name, "Spouse", f"Wife of {part_name}", spouse_photo)

        # 3. Children
        child_cols = [
            (12, 13, 14, 16, 1),
            (17, 18, 19, 21, 2),
            (22, 23, None, 25, 3),
            (26, 27, None, 29, 4),
            (30, 31, None, 33, 5),
        ]
        for name_col, ser_col, rel_col, photo_col, _ in child_cols:
            c_name = ws.cell(r, name_col).value
            c_serial = ws.cell(r, ser_col).value
            c_photo = ws.cell(r, photo_col).value
            c_override = ws.cell(r, rel_col).value if rel_col else None
            if c_name and str(c_name).strip() and c_serial:
                c_str = str(c_name).strip()
                c_ser = str(c_serial).strip()
                if c_str.lower() not in ["n/a", "na", "nil", "none"]:
                    rel = gen.get_child_relation(c_str, part_name, c_override)
                    add_person(c_ser, c_str, "Child", rel, c_photo)

    with open(ATTENDEES_JSON, "w", encoding="utf-8") as f:
        json.dump(attendees, f, ensure_ascii=False, indent=2)

    b64_json_path = os.path.join(OUT_DIR, "photos_b64.json")
    with open(b64_json_path, "w", encoding="utf-8") as f:
        json.dump(photo_b64_map, f, ensure_ascii=False)

    print(f"Built {len(attendees)} attendee records ({len(photo_b64_map)} photos cached).")
    print(f"Saved JSON to {ATTENDEES_JSON}")


if __name__ == "__main__":
    main()
