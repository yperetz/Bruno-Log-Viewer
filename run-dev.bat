@echo off
REM Run from Node.js Command Prompt, or ensure Node.js is in PATH
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo npm not found. Please install Node.js from https://nodejs.org
  echo Or run this from "Node.js Command Prompt" from Start Menu
  pause
  exit /b 1
)
call npm install
call npm run dev
