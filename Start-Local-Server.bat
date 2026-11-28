@echo off
title Blueprint Event Management // Local Server (Port 8088)
cd /d "%~dp0"
echo Starting Blueprint Local Server on http://localhost:8088/ ...
python server.py
pause
