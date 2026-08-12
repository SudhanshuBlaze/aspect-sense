@echo off
SETLOCAL EnableDelayedExpansion

echo =========================================
echo   Starting AspectSense FastAPI Server    
echo =========================================

SET "SERVER_DIR=%~dp0"

:: 1. Setup Virtual Environment
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


:: 2. Free Port 8000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING 2^>nul') do taskkill /F /PID %%a >nul 2>&1

echo Starting uvicorn server on http://localhost:8000 ...
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
