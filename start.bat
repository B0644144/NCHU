@echo off
cd /d "%~dp0server"

set NODE_ENV=production
set PORT=3001
set TZ=Asia/Taipei
set LOG_LEVEL=info

echo Starting TREK Server on port 3001...
echo Please open your browser to http://localhost:3001
echo Press Ctrl+C to stop the server.

npm start
pause
