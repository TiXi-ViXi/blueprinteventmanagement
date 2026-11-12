#!/bin/bash
# ==============================================================================
# THE BLUEPRINT EVENT MANAGEMENT // LINUX VPS ONE-CLICK LAUNCH SCRIPT
# ==============================================================================

PORT=${PORT:-8088}
cd "$(dirname "$0")"

echo "=================================================================="
echo "  THE BLUEPRINT EVENT MANAGEMENT // STARTING ON VPS"
echo "  Host: 0.0.0.0 | Port: $PORT"
echo "=================================================================="

# Check for Python 3
if command -v python3 &>/dev/null; then
    echo "Starting via Python 3 Production Gateway..."
    exec python3 server.py
elif command -v python &>/dev/null; then
    echo "Starting via Python Production Gateway..."
    exec python server.py
elif command -v docker &>/dev/null && command -v docker-compose &>/dev/null; then
    echo "Starting via Docker Compose..."
    docker-compose up -d
    echo "Container started on port $PORT"
elif command -v npx &>/dev/null; then
    echo "Starting via Node.js serve..."
    npx serve -s . -l $PORT
else
    echo "ERROR: Neither Python 3, Docker, nor Node.js was found on this VPS."
    echo "Please install Python 3 (e.g. 'sudo apt install python3') and re-run."
    exit 1
fi
