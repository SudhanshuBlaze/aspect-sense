@echo off
SETLOCAL EnableDelayedExpansion

echo =========================================
echo   Starting AspectSense Application (Windows)
echo =========================================

SET "ROOT_DIR=%~dp0"
SET "SERVER_DIR=%ROOT_DIR%server"
SET "CLIENT_DIR=%ROOT_DIR%client"

:: 1. Setup Python Virtual Environment & Dependencies
echo [1/3] Checking Python virtual environment for backend...
if not exist "%SERVER_DIR%\.venv" (
    echo Creating .venv in %SERVER_DIR%...
    python -m venv "%SERVER_DIR%\.venv"
    call "%SERVER_DIR%\.venv\Scripts\activate.bat"
    echo Installing backend requirements...
    python -m pip install --upgrade pip setuptools wheel --quiet
    pip install -r "%SERVER_DIR%\requirements.txt" --quiet
    echo Downloading spaCy models...
    python -m spacy download en_core_web_sm >nul 2>&1
    python -m spacy download en_core_web_lg >nul 2>&1
) else (
    echo Virtual environment .venv already exists. Skipping dependency installation.
    call "%SERVER_DIR%\.venv\Scripts\activate.bat"
)


:: 2. Free Port 8000 and Start FastAPI Backend Server
echo [2/3] Starting FastAPI backend server on http://localhost:8000 ...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING 2^>nul') do taskkill /F /PID %%a >nul 2>&1

start "AspectSense Backend Server (FastAPI)" /D "%SERVER_DIR%" cmd /k "call .venv\Scripts\activate.bat && uvicorn app:app --host 0.0.0.0 --port 8000 --reload"

:: 3. Free Port 3000 and Start React Frontend Client
echo [3/3] Starting React frontend client on http://localhost:3000 ...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING 2^>nul') do taskkill /F /PID %%a >nul 2>&1

if not exist "%CLIENT_DIR%\node_modules" (
    echo Installing frontend dependencies via npm install...
    cd /d "%CLIENT_DIR%"
    call npm install
)

start "AspectSense Frontend Client (React)" /D "%CLIENT_DIR%" cmd /k "npm start"

echo.
echo =======================================================
echo   AspectSense is starting up on Windows!              
echo   Backend URL:  http://localhost:8000                  
echo   Frontend URL: http://localhost:3000                  
echo =======================================================
