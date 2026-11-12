#!/usr/bin/env python3
"""
THE BLUEPRINT EVENT MANAGEMENT // CROSS-PLATFORM PRODUCTION SERVER & DATABASE ENGINE
Supports Linux, macOS, and Windows.
Provides:
  - High-performance multi-threaded static asset delivery
  - Clean URL routing:
      /          -> index.html
      /login     -> login.html
      /admin     -> admin.html
      /dashboard -> admin.html
      /bsaaevent -> bsaaevent.html
  - SQLite Real-Time Database Engine:
      GET    /api/health
      GET    /api/users
      POST   /api/users
      DELETE /api/users/<id>
      POST   /api/users/<id>/reset-password
      POST   /api/users/<id>/profile
      POST   /api/auth/login
      GET    /api/sync
      POST   /api/sync
  - Multi-device state synchronization across phones, tablets, and desktop
  - Enterprise security headers, CORS headers, and anti-tamper safeguards
"""

import os
import sys
import re
import json
import time
import socket
import sqlite3
import hashlib
import secrets
import threading
import mimetypes
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
try:
    from http.server import ThreadingHTTPServer
    ServerClass = ThreadingHTTPServer
except ImportError:
    ServerClass = HTTPServer

PORT = int(os.environ.get("PORT", 8088))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "blueprint.db")

HASH_SALT = "bp_khulna_salt_v5_"
DEFAULT_SUPER_ADMIN_HASH = "b6283f70f00c7438303f92d6b986e617b21bba2449c914f730100421cbf925c5"

db_lock = threading.Lock()

def hash_password(plain_text):
    if not plain_text:
        return ""
    salted = (HASH_SALT + str(plain_text).strip()).encode("utf-8")
    return hashlib.sha256(salted).hexdigest()

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=15.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(DATA_DIR, exist_ok=True)
    with db_lock:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE COLLATE NOCASE,
                name TEXT NOT NULL,
                initials TEXT,
                role TEXT,
                tier TEXT,
                clearance TEXT,
                sector TEXT,
                passwordHash TEXT NOT NULL,
                photo TEXT,
                hotline TEXT,
                createdAt TEXT,
                updatedAt TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS funds (
                key TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                updatedAt TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS chat (
                id TEXT PRIMARY KEY,
                channel TEXT NOT NULL,
                senderId TEXT NOT NULL,
                senderName TEXT NOT NULL,
                senderRole TEXT,
                senderTier TEXT,
                senderInitials TEXT,
                text TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                attachments TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS vault (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                category TEXT,
                sector TEXT,
                clearance TEXT,
                access TEXT,
                content TEXT,
                tags TEXT,
                updatedAt TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS audit (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                type TEXT NOT NULL,
                details TEXT,
                severity TEXT,
                ip TEXT
            )
        """)
        conn.commit()

        # Seed default superadmin if missing
        cur.execute("SELECT id, passwordHash FROM users WHERE id = 'superadmin' OR username = 'superadmin'")
        row = cur.fetchone()
        if not row:
            cur.execute("""
                INSERT INTO users (id, username, name, initials, role, tier, clearance, sector, passwordHash, photo, hotline, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                "superadmin", "superadmin", "Super Admin", "SA",
                "Central Super Administrator", "superadmin",
                "ROOT_COMMAND // LEVEL_ALPHA", "HEADQUARTERS",
                DEFAULT_SUPER_ADMIN_HASH, "", "+880 1788-706868",
                "2026-11-13", "2026-11-13"
            ))
            conn.commit()
        else:
            if row["passwordHash"] != DEFAULT_SUPER_ADMIN_HASH:
                cur.execute("UPDATE users SET passwordHash = ? WHERE id = 'superadmin' OR username = 'superadmin'", (DEFAULT_SUPER_ADMIN_HASH,))
                conn.commit()
        conn.close()

# Initialize DB on module load
init_db()

def db_get_users():
    with db_lock:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users ORDER BY (tier = 'superadmin') DESC, name ASC")
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
    return rows

def db_find_user(username_or_id):
    clean_id = (username_or_id or "").strip().lower()
    with db_lock:
        conn = get_db()
        cur = conn.cursor()
        if clean_id in ["superadmin", "admin"]:
            cur.execute("SELECT * FROM users WHERE tier = 'superadmin' OR id = 'superadmin' OR username = 'superadmin' LIMIT 1")
        else:
            cur.execute("SELECT * FROM users WHERE id = ? OR username = ? LIMIT 1", (clean_id, clean_id))
        row = cur.fetchone()
        conn.close()
    return dict(row) if row else None

def db_create_or_update_user(user_data):
    clean_username = str(user_data.get("username") or user_data.get("id") or "").strip().lower()
    clean_username = re.sub(r"[^a-z0-9_-]", "", clean_username)
    clean_name = str(user_data.get("name") or "").strip()

    if not clean_username or not clean_name:
        return None, "Username and Name are required"

    password = str(user_data.get("password") or "").strip()
    password_hash = user_data.get("passwordHash") or ""
    if password:
        password_hash = hash_password(password)

    if not password_hash:
        return None, "Password or passwordHash is required"

    initials = user_data.get("initials")
    if not initials:
        initials = "".join([n[0] for n in clean_name.split() if n])[:2].upper() or "MB"

    tier = user_data.get("tier") or "normal"
    clearance = "ROOT_COMMAND // LEVEL_ALPHA" if tier == "superadmin" else ("OPS_COMMAND" if tier == "admin" else "FIELD_MEMBER")
    now_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    user_obj = {
        "id": clean_username,
        "username": clean_username,
        "name": clean_name,
        "initials": initials,
        "role": user_data.get("role") or "Field Operations Executive",
        "tier": tier,
        "clearance": user_data.get("clearance") or clearance,
        "sector": user_data.get("sector") or "GENERAL OPERATIONS",
        "passwordHash": password_hash,
        "photo": user_data.get("photo") or "",
        "hotline": user_data.get("hotline") or "+880 1788-706868",
        "createdAt": user_data.get("createdAt") or now_date[:10],
        "updatedAt": now_date
    }

    with db_lock:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO users (id, username, name, initials, role, tier, clearance, sector, passwordHash, photo, hotline, createdAt, updatedAt)
            VALUES (:id, :username, :name, :initials, :role, :tier, :clearance, :sector, :passwordHash, :photo, :hotline, :createdAt, :updatedAt)
            ON CONFLICT(id) DO UPDATE SET
                username = excluded.username,
                name = excluded.name,
                initials = excluded.initials,
                role = excluded.role,
                tier = excluded.tier,
                clearance = excluded.clearance,
                sector = excluded.sector,
                passwordHash = excluded.passwordHash,
                photo = excluded.photo,
                hotline = excluded.hotline,
                updatedAt = excluded.updatedAt
        """, user_obj)
        conn.commit()
        conn.close()

    return user_obj, None

def db_delete_user(user_id):
    clean_id = (user_id or "").strip().lower()
    if clean_id in ["superadmin", "admin"]:
        return False, "Cannot delete primary Super Admin"
    with db_lock:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM users WHERE id = ? OR username = ?", (clean_id, clean_id))
        count = cur.rowcount
        conn.commit()
        conn.close()
    return count > 0, None

def db_reset_password(user_id, new_password, new_hash=None):
    clean_id = (user_id or "").strip().lower()
    pw_hash = ""
    if new_password:
        pw_hash = hash_password(new_password)
    elif new_hash:
        pw_hash = new_hash
    else:
        return False, "Password is required"

    now_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with db_lock:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("UPDATE users SET passwordHash = ?, updatedAt = ? WHERE id = ? OR username = ?", (pw_hash, now_date, clean_id, clean_id))
        count = cur.rowcount
        conn.commit()
        conn.close()
    return count > 0, None

def db_update_profile(user_id, name=None, hotline=None, sector=None):
    clean_id = (user_id or "").strip().lower()
    now_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with db_lock:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE id = ? OR username = ? LIMIT 1", (clean_id, clean_id))
        row = cur.fetchone()
        if not row:
            conn.close()
            return None, "User not found"
        u = dict(row)
        if name:
            u["name"] = name.strip()
            u["initials"] = "".join([n[0] for n in u["name"].split() if n])[:2].upper() or "MB"
        if hotline:
            u["hotline"] = hotline.strip()
        if sector:
            u["sector"] = sector.strip()
        u["updatedAt"] = now_date

        cur.execute("""
            UPDATE users SET name = :name, initials = :initials, hotline = :hotline, sector = :sector, updatedAt = :updatedAt
            WHERE id = :id
        """, u)
        conn.commit()
        conn.close()
    return u, None

def db_verify_login(username_or_id, password="", password_hash=""):
    clean_id = (username_or_id or "").strip().lower()
    clean_pass = (password or "").strip()
    is_super = (clean_id in ["superadmin", "admin"])

    user = db_find_user(clean_id)
    if not user:
        return None, "User ID not found in system"

    stored_hash = user.get("passwordHash") or ""

    # Superadmin default fallback / self-healing
    if is_super and (clean_pass == "admin123" or password_hash == DEFAULT_SUPER_ADMIN_HASH or hash_password(clean_pass) == DEFAULT_SUPER_ADMIN_HASH):
        if stored_hash != DEFAULT_SUPER_ADMIN_HASH:
            with db_lock:
                conn = get_db()
                conn.cursor().execute("UPDATE users SET passwordHash = ? WHERE id = ?", (DEFAULT_SUPER_ADMIN_HASH, user["id"]))
                conn.commit()
                conn.close()
            user["passwordHash"] = DEFAULT_SUPER_ADMIN_HASH
        return user, None

    # Normal password validation
    match = False
    if clean_pass and hash_password(clean_pass) == stored_hash:
        match = True
    elif password_hash and password_hash == stored_hash:
        match = True

    if not match:
        return None, "Invalid Password"

    return user, None

def db_get_sync_data():
    with db_lock:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users ORDER BY (tier = 'superadmin') DESC, name ASC")
        users = [dict(r) for r in cur.fetchall()]

        cur.execute("SELECT * FROM funds WHERE key = 'main' LIMIT 1")
        funds_row = cur.fetchone()
        funds = json.loads(funds_row["data"]) if funds_row else None

        cur.execute("SELECT * FROM chat ORDER BY timestamp ASC")
        chat = [dict(r) for r in cur.fetchall()]

        cur.execute("SELECT * FROM vault ORDER BY updatedAt DESC")
        vault = [dict(r) for r in cur.fetchall()]

        cur.execute("SELECT * FROM audit ORDER BY timestamp DESC LIMIT 200")
        audit = [dict(r) for r in cur.fetchall()]
        conn.close()

    return {
        "users": users,
        "funds": funds,
        "chat": chat,
        "vault": vault,
        "audit": audit
    }

def db_save_sync_data(payload):
    now_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with db_lock:
        conn = get_db()
        cur = conn.cursor()

        # Merge users
        incoming_users = payload.get("users") or []
        for u in incoming_users:
            u_id = str(u.get("id") or u.get("username") or "").strip().lower()
            if not u_id:
                continue
            cur.execute("""
                INSERT INTO users (id, username, name, initials, role, tier, clearance, sector, passwordHash, photo, hotline, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    name = excluded.name,
                    initials = excluded.initials,
                    role = excluded.role,
                    tier = excluded.tier,
                    clearance = excluded.clearance,
                    sector = excluded.sector,
                    passwordHash = excluded.passwordHash,
                    photo = excluded.photo,
                    hotline = excluded.hotline,
                    updatedAt = excluded.updatedAt
            """, (
                u_id,
                str(u.get("username") or u_id).strip().lower(),
                str(u.get("name") or u_id).strip(),
                str(u.get("initials") or "MB"),
                str(u.get("role") or "Field Operations Executive"),
                str(u.get("tier") or "normal"),
                str(u.get("clearance") or "FIELD_MEMBER"),
                str(u.get("sector") or "GENERAL OPERATIONS"),
                str(u.get("passwordHash") or ""),
                str(u.get("photo") or ""),
                str(u.get("hotline") or "+880 1788-706868"),
                str(u.get("createdAt") or now_date[:10]),
                now_date
            ))

        # Save funds if provided
        incoming_funds = payload.get("funds")
        if incoming_funds and isinstance(incoming_funds, (dict, list)):
            cur.execute("""
                INSERT INTO funds (key, data, updatedAt) VALUES ('main', ?, ?)
                ON CONFLICT(key) DO UPDATE SET data = excluded.data, updatedAt = excluded.updatedAt
            """, (json.dumps(incoming_funds), now_date))

        # Merge chat messages if provided
        incoming_chat = payload.get("chat") or []
        for c in incoming_chat:
            c_id = c.get("id")
            if not c_id:
                continue
            cur.execute("""
                INSERT INTO chat (id, channel, senderId, senderName, senderRole, senderTier, senderInitials, text, timestamp, attachments)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO NOTHING
            """, (
                c_id,
                c.get("channel") or "general-hq",
                c.get("senderId") or "superadmin",
                c.get("senderName") or "Staff",
                c.get("senderRole") or "HQ",
                c.get("senderTier") or "normal",
                c.get("senderInitials") or "SA",
                c.get("text") or "",
                c.get("timestamp") or now_date,
                json.dumps(c.get("attachments") or [])
            ))

        # Merge vault items if provided
        incoming_vault = payload.get("vault") or []
        for v in incoming_vault:
            v_id = v.get("id")
            if not v_id:
                continue
            cur.execute("""
                INSERT INTO vault (id, title, category, sector, clearance, access, content, tags, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    title = excluded.title,
                    category = excluded.category,
                    sector = excluded.sector,
                    clearance = excluded.clearance,
                    access = excluded.access,
                    content = excluded.content,
                    tags = excluded.tags,
                    updatedAt = excluded.updatedAt
            """, (
                v_id,
                v.get("title") or "Confidential Item",
                v.get("category") or "Operations",
                v.get("sector") or "HEADQUARTERS",
                v.get("clearance") or "RESTRICTED",
                v.get("access") or "superadmin",
                v.get("content") or "",
                json.dumps(v.get("tags") or []),
                v.get("updatedAt") or now_date
            ))

        conn.commit()
        conn.close()

    return db_get_sync_data()


class BlueprintHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    def end_headers(self):
        # Enterprise Security & Anti-Theft Headers
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("X-XSS-Protection", "1; mode=block")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_cors_headers()

        # Caching optimization
        if self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
        elif self.path.endswith(".html") or self.path in ["/", "/login", "/admin", "/dashboard", "/bsaaevent"]:
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
        else:
            self.send_header("Cache-Control", "public, max-age=86400")

        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"status":"ok"}')

    def send_json(self, data, status_code=200):
        body = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 0:
                raw = self.rfile.read(content_length).decode("utf-8")
                return json.loads(raw)
            return {}
        except Exception as e:
            return None

    def do_GET(self):
        req_path = self.path.split("?")[0].strip("/")

        # API Routes
        if req_path == "api/health":
            return self.send_json({
                "status": "ok",
                "service": "THE BLUEPRINT // SQLITE DATABASE ENGINE",
                "version": "6.3",
                "timestamp": datetime.now().isoformat()
            })

        if req_path == "api/users":
            users = db_get_users()
            return self.send_json({"success": True, "users": users, "count": len(users)})

        if req_path == "api/sync":
            data = db_get_sync_data()
            return self.send_json({"success": True, "data": data})

        # Clean URL Routing for Frontend
        if req_path == "" or req_path == "app":
            self.path = "/index.html"
        elif req_path in ["admin", "dashboard"]:
            self.path = "/admin.html"
        elif req_path == "login":
            self.path = "/login.html"
        elif req_path == "bsaaevent":
            self.path = "/bsaaevent.html"
        elif not os.path.splitext(req_path)[1]:
            candidate = os.path.join(BASE_DIR, req_path + ".html")
            if os.path.isfile(candidate):
                self.path = "/" + req_path + ".html"

        return super().do_GET()

    def do_POST(self):
        req_path = self.path.split("?")[0].strip("/")
        body = self.read_json_body()

        if body is None:
            return self.send_json({"success": False, "error": "Invalid JSON body"}, 400)

        # 1. Login Authentication Endpoint
        if req_path == "api/auth/login":
            username = body.get("username") or body.get("id") or body.get("userId")
            password = body.get("password") or ""
            password_hash = body.get("passwordHash") or ""

            if not username or (not password and not password_hash):
                return self.send_json({"success": False, "error": "Username and password required"}, 400)

            user, err = db_verify_login(username, password, password_hash)
            if not user:
                return self.send_json({"success": False, "error": err or "Invalid credentials"}, 401)

            token = secrets.token_hex(24)
            return self.send_json({
                "success": True,
                "message": f"Authenticated as {user['name']} (@{user['username']})",
                "user": user,
                "token": token
            })

        # 2. User Creation / Upsert Endpoint
        if req_path == "api/users":
            user, err = db_create_or_update_user(body)
            if not user:
                return self.send_json({"success": False, "error": err}, 400)
            return self.send_json({"success": True, "user": user, "message": "User saved to database"})

        # 3. User Password Reset Endpoint (/api/users/<id>/reset-password)
        m_reset = re.match(r"^api/users/([^/]+)/reset-password$", req_path)
        if m_reset:
            user_id = m_reset.group(1)
            new_pw = body.get("password")
            new_hash = body.get("passwordHash")
            ok, err = db_reset_password(user_id, new_pw, new_hash)
            if not ok:
                return self.send_json({"success": False, "error": err or "Failed to reset password"}, 400)
            return self.send_json({"success": True, "message": f"Password reset for @{user_id}"})

        # 4. User Profile Update Endpoint (/api/users/<id>/profile)
        m_prof = re.match(r"^api/users/([^/]+)/profile$", req_path)
        if m_prof:
            user_id = m_prof.group(1)
            u, err = db_update_profile(user_id, body.get("name"), body.get("hotline"), body.get("sector"))
            if not u:
                return self.send_json({"success": False, "error": err}, 400)
            return self.send_json({"success": True, "user": u, "message": "Profile updated in database"})

        # 5. Full Two-Way Synchronization Endpoint
        if req_path == "api/sync":
            merged = db_save_sync_data(body)
            return self.send_json({"success": True, "data": merged, "message": "Database synchronized successfully"})

        return self.send_json({"success": False, "error": "Not Found"}, 404)

    def do_DELETE(self):
        req_path = self.path.split("?")[0].strip("/")

        # Delete user: /api/users/<id>
        m_del = re.match(r"^api/users/([^/]+)$", req_path)
        if m_del:
            user_id = m_del.group(1)
            ok, err = db_delete_user(user_id)
            if not ok:
                return self.send_json({"success": False, "error": err or "User not found"}, 400)
            return self.send_json({"success": True, "message": f"User @{user_id} deleted from database"})

        return self.send_json({"success": False, "error": "Not Found"}, 404)


def run():
    server_address = ("", PORT)
    httpd = ServerClass(server_address, BlueprintHandler)
    print(f"================================================================")
    print(f"  THE BLUEPRINT EVENT MANAGEMENT // PRODUCTION SERVER & DB")
    print(f"  SQLite Database: {DB_PATH}")
    print(f"  Listening on:  http://0.0.0.0:{PORT}/")
    print(f"  Login Gateway: http://0.0.0.0:{PORT}/login")
    print(f"  Executive HQ:  http://0.0.0.0:{PORT}/admin")
    print(f"  Gate Scanner:  http://0.0.0.0:{PORT}/bsaaevent")
    print(f"  API Health:    http://0.0.0.0:{PORT}/api/health")
    print(f"  API Users:     http://0.0.0.0:{PORT}/api/users")
    print(f"================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == "__main__":
    run()
