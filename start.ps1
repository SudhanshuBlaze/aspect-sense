# PowerShell Startup Script for AspectSense on Windows
$ErrorActionPreference = "Stop"

$ROOT_DIR = $PSScriptRoot
$SERVER_DIR = Join-Path $ROOT_DIR "server"
$CLIENT_DIR = Join-Path $ROOT_DIR "client"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Starting AspectSense Application (Windows)  " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Python Virtual Environment
Write-Host "[1/3] Checking Python virtual environment for backend..." -ForegroundColor Yellow
$VENV_DIR = Join-Path $SERVER_DIR ".venv"
$VENV_PYTHON = Join-Path $VENV_DIR "Scripts\python.exe"
$VENV_PIP = Join-Path $VENV_DIR "Scripts\pip.exe"

if (-not (Test-Path $VENV_DIR)) {
    Write-Host "Creating .venv in $SERVER_DIR..." -ForegroundColor Yellow
    python -m venv $VENV_DIR
    Write-Host "Installing backend requirements..." -ForegroundColor Yellow
    & $VENV_PYTHON -m pip install --upgrade pip setuptools wheel --quiet
    & $VENV_PIP install -r (Join-Path $SERVER_DIR "requirements.txt") --quiet
    Write-Host "Downloading spaCy models..." -ForegroundColor Yellow
    & $VENV_PYTHON -m spacy download en_core_web_sm | Out-Null
    & $VENV_PYTHON -m spacy download en_core_web_lg | Out-Null
} else {
    Write-Host "Virtual environment .venv already exists. Skipping dependency installation." -ForegroundColor Green
}


# 2. Free Port 8000 & Start FastAPI Backend Server
Write-Host "[2/3] Starting FastAPI backend server on http://localhost:8000 ..." -ForegroundColor Yellow
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    Stop-Process -Id $port8000.OwningProcess -Force -ErrorAction SilentlyContinue
}

Start-Process cmd.exe -ArgumentList "/k cd /d ""$SERVER_DIR"" && call .venv\Scripts\activate.bat && uvicorn app:app --host 0.0.0.0 --port 8000 --reload" -WindowStyle Normal

# 3. Free Port 3000 & Start React Frontend Client
Write-Host "[3/3] Starting React frontend client on http://localhost:3000 ..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Stop-Process -Id $port3000.OwningProcess -Force -ErrorAction SilentlyContinue
}

if (-not (Test-Path (Join-Path $CLIENT_DIR "node_modules"))) {
    Write-Host "Installing frontend dependencies via npm install..." -ForegroundColor Yellow
    Set-Location $CLIENT_DIR
    npm install
}

Start-Process cmd.exe -ArgumentList "/k cd /d ""$CLIENT_DIR"" && npm start" -WindowStyle Normal

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  AspectSense is starting up on Windows!              " -ForegroundColor Green
Write-Host "  Backend URL:  http://localhost:8000                  " -ForegroundColor Green
Write-Host "  Frontend URL: http://localhost:3000                  " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
