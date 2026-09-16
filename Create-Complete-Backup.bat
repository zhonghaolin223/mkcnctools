@echo off
setlocal EnableExtensions
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\create-local-backup.ps1"
if errorlevel 1 (
  echo Backup was not completed. Leave this window open and share the message above with support.
  pause
  exit /b 1
)
echo.
echo Complete backup created in the outputs folder.
pause

