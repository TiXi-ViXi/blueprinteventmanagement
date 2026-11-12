@echo off
setlocal enabledelayedexpansion
title Push to GitHub & Deploy to VPS // The Blueprint Event Management
cd /d "%~dp0"

echo ====================================================================
echo   THE BLUEPRINT EVENT MANAGEMENT // ONE-CLICK GIT PUSH & VPS DEPLOY
echo ====================================================================
echo.

set /p MSG="Enter commit message (or press ENTER for auto): "
if "!MSG!"=="" set MSG=update: %date% %time%

echo.
echo [1/3] Staging changes...
git add -A

echo [2/3] Committing with message: "!MSG!"...
git commit -m "!MSG!"

echo [3/3] Pushing to GitHub (origin/main)...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo [!] Git push failed. Please check your internet connection or git credentials.
    pause
    exit /b %errorlevel%
)

echo.
echo [✓] Pushed to GitHub successfully!
echo.
echo --------------------------------------------------------------------
echo [VPS SYNC] Triggering live VPS deployment on 138.252.125.145...
echo --------------------------------------------------------------------

ssh -i "C:\Users\Tixi Vixi\.ssh\id_clinicos_vps" -o StrictHostKeyChecking=no root@138.252.125.145 "cd /var/www/blueprinteventmanagement && git pull origin main && pm2 restart blueprint-server && systemctl reload nginx && echo '✓ Live VPS Updated Successfully!'"

echo.
echo ====================================================================
echo   DONE! Your changes are now live at:
echo   https://blueprinteventmanagement.shop/
echo ====================================================================
echo.
pause
