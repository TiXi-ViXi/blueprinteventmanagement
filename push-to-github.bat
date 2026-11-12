@echo off
title Push to GitHub // The Blueprint Event Management
cd /d "%~dp0"
echo ====================================================================
echo  PUSHING TO GITHUB: TiXi-ViXi/blueprinteventmanagement
echo ====================================================================
echo.
"C:\Users\toxic\.tools\mingit\cmd\git.exe" push -u origin main
echo.
echo ====================================================================
echo  DONE! You can now clone or extract on your VPS.
echo ====================================================================
pause
