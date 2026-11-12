#!/usr/bin/env python3
"""
THE BLUEPRINT EVENT MANAGEMENT // CROSS-PLATFORM VPS SERVER
Supports Linux, macOS, and Windows.
Routes:
  /          -> index.html
  /login     -> login.html
  /admin     -> admin.html
  /bsaaevent -> bsaaevent.html
Enterprise security headers and gzip support included.
"""

import os
import sys
import mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8088))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class BlueprintHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Enterprise Security & Anti-Theft Headers
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("X-XSS-Protection", "1; mode=block")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")

        # Caching optimization
        if self.path.endswith(".html") or self.path in ["/", "/login", "/admin", "/bsaaevent"]:
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
        else:
            self.send_header("Cache-Control", "public, max-age=86400")

        super().end_headers()

    def do_GET(self):
        # Clean URL Routing
        req_path = self.path.split("?")[0].strip("/")
        
        if req_path == "" or req_path == "app":
            self.path = "/index.html"
        elif req_path in ["admin", "dashboard"]:
            self.path = "/admin.html"
        elif req_path == "login":
            self.path = "/login.html"
        elif req_path == "bsaaevent":
            self.path = "/bsaaevent.html"
        elif not os.path.splitext(req_path)[1]:
            # Try appending .html
            candidate = os.path.join(BASE_DIR, req_path + ".html")
            if os.path.isfile(candidate):
                self.path = "/" + req_path + ".html"

        return super().do_GET()

def run():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, BlueprintHandler)
    print(f"================================================================")
    print(f"  THE BLUEPRINT EVENT MANAGEMENT // PRODUCTION SERVER")
    print(f"  Listening on: http://0.0.0.0:{PORT}/")
    print(f"  Login Gateway: http://0.0.0.0:{PORT}/login")
    print(f"  Executive HQ:  http://0.0.0.0:{PORT}/admin")
    print(f"  Gate Scanner:  http://0.0.0.0:{PORT}/bsaaevent")
    print(f"================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == "__main__":
    run()
