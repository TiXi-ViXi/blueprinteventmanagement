"""
BSAA Family Night 2026 — Live Multi-Device Gate Scanner Server (PC + Mobile)
---------------------------------------------------------------------------
Works with Winson WNL-S011-USB (USB HID) plugged into PC or Mobile (via OTG).
Provides:
  - Real-time SQLite-backed Entry & Exit tracking synced across PC & Mobile over Wi-Fi
  - Instant attendee photo + family status display
  - Anti-double-scan cooldown & strict Entry/Exit gate modes
  - Auto QR code & LAN URL display for connecting mobile phones
  - 1-click formatted Excel (.xlsx) and UTF-8 CSV attendance & audit log exports
"""

import os
import re
import time
import json
import socket
import sqlite3
import threading
import webbrowser
from io import BytesIO
from datetime import datetime

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
import zxingcpp
import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

CUR_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(CUR_DIR, "ui_template.html")
ATTENDEES_PATH = os.path.join(CUR_DIR, "attendees.json")
PHOTOS_DIR = os.path.join(CUR_DIR, "static", "photos")
DB_PATH = os.path.join(CUR_DIR, "attendance.db")
PORT = 5000

# Load attendees
with open(ATTENDEES_PATH, "r", encoding="utf-8") as f:
    ATTENDEES = json.load(f)

BY_SERIAL = {a["serial"].upper(): a for a in ATTENDEES}
BY_COMPACT = {a["serial_compact"]: a for a in ATTENDEES}

# Render server HTML once at startup
with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
    _raw_tpl = f.read()

SERVER_HTML = (
    _raw_tpl.replace('"__APP_MODE__"', '"server"')
    .replace("__EMBEDDED_ATTENDEES__", "[]")
    .replace("__EMBEDDED_PHOTOS__", "{}")
)

DB_LOCK = threading.Lock()
STATE_VERSION = 1


def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with DB_LOCK:
        conn = get_db()
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS scan_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                serial TEXT NOT NULL,
                action TEXT NOT NULL CHECK(action IN ('ENTRY', 'EXIT')),
                timestamp TEXT NOT NULL,
                gate TEXT NOT NULL,
                manual INTEGER NOT NULL DEFAULT 0,
                created_epoch REAL NOT NULL
            )
            """
        )
        conn.commit()
        conn.close()


init_db()


def compute_state():
    """Returns (status_map, logs_newest_first)."""
    status_map = {
        a["serial"]: {"status": "outside", "last_entry": None, "last_exit": None, "scan_count": 0}
        for a in ATTENDEES
    }
    conn = get_db()
    rows = conn.execute("SELECT id, serial, action, timestamp, gate, manual, created_epoch FROM scan_logs ORDER BY id ASC").fetchall()
    conn.close()

    logs = []
    for r in rows:
        ser = r["serial"]
        st = status_map.get(ser)
        if st:
            st["scan_count"] += 1
            if r["action"] == "ENTRY":
                st["status"] = "inside"
                st["last_entry"] = r["timestamp"]
            else:
                st["status"] = "exited"
                st["last_exit"] = r["timestamp"]
        logs.append({
            "id": r["id"],
            "serial": ser,
            "action": r["action"],
            "timestamp": r["timestamp"],
            "gate": r["gate"],
            "manual": bool(r["manual"]),
            "created_epoch": r["created_epoch"],
        })
    logs.reverse()
    return status_map, logs


def resolve_attendee(raw_code: str):
    if not raw_code:
        return None
    clean = re.sub(r"\s+", " ", str(raw_code).strip().strip("*")).upper()
    if clean in BY_SERIAL:
        return BY_SERIAL[clean]
    compact = re.sub(r"[^A-Z0-9]", "", clean)
    if compact in BY_COMPACT:
        return BY_COMPACT[compact]
    m = re.match(r"^(?:BSAA|BSSA)?0*(\d+)([A-Z])$", compact)
    if m:
        norm = f"BSAA{int(m.group(1)):03d}{m.group(2)}"
        if norm in BY_COMPACT:
            return BY_COMPACT[norm]
    return None


def get_lan_ips():
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.3)
        s.connect(("8.8.8.8", 80))
        primary = s.getsockname()[0]
        s.close()
        if primary and not primary.startswith("127."):
            ips.append(primary)
    except Exception:
        pass

    try:
        for ip in socket.gethostbyname_ex(socket.gethostname())[2]:
            if ip and not ip.startswith("127.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips


app = FastAPI(title="BSAA Family Night Gate Scanner")
app.mount("/static/photos", StaticFiles(directory=PHOTOS_DIR), name="photos")


class ScanRequest(BaseModel):
    raw_code: str
    mode: str = "auto"
    cooldown_sec: float = 5.0
    gate_name: str = "Main Gate"
    manual: bool = False


@app.get("/", response_class=HTMLResponse)
def index():
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        raw = f.read()
    rendered = (
        raw.replace('"__APP_MODE__"', '"server"')
        .replace("__EMBEDDED_ATTENDEES__", "[]")
        .replace("__EMBEDDED_PHOTOS__", "{}")
    )
    return HTMLResponse(content=rendered)


@app.get("/api/info")
def api_info():
    ips = get_lan_ips()
    urls = [f"http://{ip}:{PORT}" for ip in ips] or [f"http://127.0.0.1:{PORT}"]
    primary_url = urls[0]
    bc = zxingcpp.create_barcode(primary_url, zxingcpp.BarcodeFormat.QRCode)
    qr_svg = zxingcpp.write_barcode_to_svg(bc, scale=6)
    return {
        "primary_url": primary_url,
        "urls": urls,
        "qr_svg": qr_svg,
        "total_attendees": len(ATTENDEES),
    }


@app.get("/api/state")
def api_state(since_version: int = -1):
    global STATE_VERSION
    if since_version == STATE_VERSION:
        return {"unchanged": True, "version": STATE_VERSION}

    with DB_LOCK:
        status_map, logs = compute_state()
        return {
            "unchanged": False,
            "version": STATE_VERSION,
            "attendees": ATTENDEES if since_version < 0 else None,
            "status_map": status_map,
            "logs": logs[:300],
        }


@app.post("/api/scan")
def api_scan(req: ScanRequest):
    global STATE_VERSION
    person = resolve_attendee(req.raw_code)
    if not person:
        return {
            "ok": False,
            "outcome": "INVALID",
            "raw_code": req.raw_code,
            "message": "Barcode not found in BSAA database",
            "version": STATE_VERSION,
        }

    with DB_LOCK:
        status_map, logs = compute_state()
        st = status_map[person["serial"]]
        now_epoch = time.time()

        # Anti-double-scan cooldown check
        if req.cooldown_sec > 0 and req.mode not in ("entry_force", "exit_force"):
            for l in logs:
                if l["serial"] == person["serial"]:
                    diff = now_epoch - l["created_epoch"]
                    if diff < req.cooldown_sec:
                        return {
                            "ok": False,
                            "outcome": "COOLDOWN",
                            "attendee": person,
                            "attendee_state": st,
                            "message": f"Double-scan blocked ({diff:.1f}s ago)",
                            "status_map": status_map,
                            "logs": logs[:300],
                            "version": STATE_VERSION,
                        }
                    break

        if req.mode == "auto":
            action = "EXIT" if st["status"] == "inside" else "ENTRY"
        elif req.mode == "entry":
            if st["status"] == "inside":
                last_t = st["last_entry"].split(" ")[1] if st["last_entry"] else "earlier"
                return {
                    "ok": False,
                    "outcome": "ALREADY_INSIDE",
                    "attendee": person,
                    "attendee_state": st,
                    "message": f"Already INSIDE since {last_t}",
                    "status_map": status_map,
                    "logs": logs[:300],
                    "version": STATE_VERSION,
                }
            action = "ENTRY"
        elif req.mode == "exit":
            if st["status"] != "inside":
                return {
                    "ok": False,
                    "outcome": "NOT_INSIDE",
                    "attendee": person,
                    "attendee_state": st,
                    "message": "Not marked INSIDE yet",
                    "status_map": status_map,
                    "logs": logs[:300],
                    "version": STATE_VERSION,
                }
            action = "EXIT"
        elif req.mode == "entry_force":
            action = "ENTRY"
        elif req.mode == "exit_force":
            action = "EXIT"
        else:
            action = "EXIT" if st["status"] == "inside" else "ENTRY"

        ts_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        conn = get_db()
        cur = conn.execute(
            "INSERT INTO scan_logs (serial, action, timestamp, gate, manual, created_epoch) VALUES (?, ?, ?, ?, ?, ?)",
            (person["serial"], action, ts_str, req.gate_name.strip() or "Gate", 1 if req.manual else 0, now_epoch),
        )
        log_id = cur.lastrowid
        conn.commit()
        conn.close()

        STATE_VERSION += 1
        new_status_map, new_logs = compute_state()

        return {
            "ok": True,
            "outcome": action,
            "log_id": log_id,
            "attendee": person,
            "attendee_state": new_status_map[person["serial"]],
            "message": "ENTRY GRANTED" if action == "ENTRY" else "EXIT RECORDED",
            "status_map": new_status_map,
            "logs": new_logs[:300],
            "version": STATE_VERSION,
        }


@app.delete("/api/logs/{log_id}")
def api_delete_log(log_id: int):
    global STATE_VERSION
    with DB_LOCK:
        conn = get_db()
        conn.execute("DELETE FROM scan_logs WHERE id = ?", (log_id,))
        conn.commit()
        conn.close()
        STATE_VERSION += 1
    return {"ok": True, "version": STATE_VERSION}


@app.post("/api/reset")
def api_reset():
    global STATE_VERSION
    with DB_LOCK:
        conn = get_db()
        conn.execute("DELETE FROM scan_logs")
        conn.commit()
        conn.close()
        STATE_VERSION += 1
    return {"ok": True, "version": STATE_VERSION}


@app.get("/api/export/csv")
def api_export_csv():
    import csv
    from io import StringIO

    with DB_LOCK:
        status_map, _ = compute_state()

    buf = StringIO()
    buf.write("\ufeff")  # UTF-8 BOM for Excel
    writer = csv.writer(buf)
    writer.writerow(["SL No", "Serial", "Name", "Category", "Designation/Relation", "Company", "Phone", "Current Status", "Last Entry", "Last Exit", "Total Scans"])
    for a in ATTENDEES:
        st = status_map[a["serial"]]
        writer.writerow([
            a["sl"], a["serial"], a["name"], a["role"], a["designation"], a["company"], a["phone"],
            st["status"].upper(), st["last_entry"] or "", st["last_exit"] or "", st["scan_count"]
        ])

    filename = f"BSAA_Attendance_{datetime.now().strftime('%Y-%m-%d_%H-%M')}.csv"
    return Response(
        content=buf.getvalue().encode("utf-8"),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@app.get("/api/export/xlsx")
def api_export_xlsx():
    with DB_LOCK:
        status_map, logs = compute_state()

    wb = openpyxl.Workbook()
    header_fill = PatternFill(start_color="0B1B3D", end_color="0B1B3D", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF")

    # Sheet 1: Summary
    ws1 = wb.active
    ws1.title = "Attendance Summary"
    cols1 = ["SL No", "Serial", "Name", "Category", "Designation / Relation", "Company", "Phone", "Current Status", "Last Entry", "Last Exit", "Total Scans"]
    ws1.append(cols1)
    for cell in ws1[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center")

    for a in ATTENDEES:
        st = status_map[a["serial"]]
        ws1.append([
            a["sl"], a["serial"], a["name"], a["role"], a["designation"], a["company"], a["phone"],
            st["status"].upper(), st["last_entry"] or "", st["last_exit"] or "", st["scan_count"]
        ])

    # Sheet 2: Scan Audit Log
    ws2 = wb.create_sheet("Entry & Exit Scan Log")
    cols2 = ["Log ID", "Timestamp", "Serial", "Name", "Category", "Company", "Action", "Gate", "Method"]
    ws2.append(cols2)
    for cell in ws2[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center")

    for l in reversed(logs):  # chronological order
        p = BY_SERIAL.get(l["serial"].upper(), {})
        ws2.append([
            l["id"], l["timestamp"], l["serial"], p.get("name", ""), p.get("role", ""),
            p.get("company", ""), l["action"], l["gate"], "Manual" if l["manual"] else "WNL-S011-USB"
        ])

    for ws in (ws1, ws2):
        for col in ws.columns:
            max_len = max(len(str(c.value or "")) for c in col)
            ws.column_dimensions[col[0].column_letter].width = min(max_len + 4, 42)

    out = BytesIO()
    wb.save(out)
    filename = f"BSAA_Attendance_Report_{datetime.now().strftime('%Y-%m-%d_%H-%M')}.xlsx"
    return Response(
        content=out.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


def open_browser_delayed():
    time.sleep(1.2)
    webbrowser.open(f"http://127.0.0.1:{PORT}")


if __name__ == "__main__":
    ips = get_lan_ips()
    print("=" * 64)
    print("  BSAA FAMILY NIGHT 2026 — GATE SCANNER SERVER")
    print("=" * 64)
    print(f"  PC URL:     http://127.0.0.1:{PORT}")
    for ip in ips:
        print(f"  Mobile URL: http://{ip}:{PORT}  (Open on phone over same Wi-Fi)")
    print("  Scanner:    Plug in WNL-S011-USB & scan any ID Card barcode")
    print("=" * 64)
    threading.Thread(target=open_browser_delayed, daemon=True).start()
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="warning")
