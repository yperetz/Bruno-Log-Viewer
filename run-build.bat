@echo off
REM Compile to Windows exe - run from Node.js Command Prompt
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo npm not found. Please install Node.js from https://nodejs.org
  echo Or run this from "Node.js Command Prompt" from Start Menu
  pause
  exit /b 1
)
echo Closing Bruno Log Viewer if running...
taskkill /IM "Bruno Log Viewer.exe" /F 2>nul
timeout /t 2 /nobreak >nul
call npm install
call npm run build
echo.
echo Build complete!
echo.
echo EXE location: release\win-unpacked\Bruno Log Viewer.exe
echo.
echo Open folder: release\win-unpacked\
explorer "release\win-unpacked"
pause
