@echo off
setlocal EnableExtensions
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22.13 or newer is required before the preview can start.
  echo Install the current Node.js LTS version, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing the website dependencies. This only happens the first time.
  call corepack pnpm install --frozen-lockfile
  if errorlevel 1 (
    echo Installation could not be completed. Check the internet connection and try again.
    pause
    exit /b 1
  )
)

echo Starting the local MingKai website preview...
echo Keep this window open while using the preview.
start "" powershell.exe -NoProfile -Command "Start-Sleep -Seconds 4; Start-Process 'http://localhost:5173/admin'"
call corepack pnpm dev
