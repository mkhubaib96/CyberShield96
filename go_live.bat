@echo off
echo ===================================================
echo   KIDGUARD FRESH START - GO LIVE SCRIPT
echo ===================================================

echo 1. Installing Frontend Dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing frontend dependencies.
    pause
    exit /b %ERRORLEVEL%
)

echo 2. Building Frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error building frontend.
    pause
    exit /b %ERRORLEVEL%
)

echo 3. Installing Backend Dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing backend dependencies.
    cd ..
    pause
    exit /b %ERRORLEVEL%
)

echo 4. Starting Unified Server...
echo ===================================================
echo   App will be available at: http://localhost:3000
echo ===================================================
npm start
