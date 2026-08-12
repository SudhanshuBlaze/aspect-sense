#!/usr/bin/env bash
set -e

# ROOT directory of project
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"
CLIENT_DIR="$ROOT_DIR/client"

echo "========================================="
echo "  Starting AspectSense Application      "
echo "========================================="

# Helper function to check and free port if occupied
free_port() {
    local port=$1
    local pids=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo "Port $port is currently occupied by PID(s): $pids. Freeing port $port..."
        kill -9 $pids 2>/dev/null || true
        sleep 1
    fi
}

# 1. Setup Server Virtual Environment & Dependencies
echo "[1/3] Checking Python virtual environment for backend..."
if [ ! -d "$SERVER_DIR/.venv" ]; then
    echo "Creating .venv in $SERVER_DIR..."
    python3 -m venv "$SERVER_DIR/.venv"
    source "$SERVER_DIR/.venv/bin/activate"
    echo "Installing backend requirements..."
    pip install --upgrade pip setuptools wheel --quiet
    pip install -r "$SERVER_DIR/requirements.txt" --quiet
    echo "Downloading spaCy models..."
    python -m spacy download en_core_web_sm > /dev/null 2>&1 || true
    python -m spacy download en_core_web_lg > /dev/null 2>&1 || true
else
    echo "Virtual environment .venv already exists. Skipping dependency installation."
    source "$SERVER_DIR/.venv/bin/activate"
fi


# Function to clean up background processes on Ctrl+C or script exit
cleanup() {
    echo ""
    echo "Shutting down AspectSense server and client processes..."
    kill $SERVER_PID 2>/dev/null || true
    kill $CLIENT_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 2. Free port 8000 and Start FastAPI Server
free_port 8000

echo "[2/3] Starting FastAPI backend server on http://localhost:8000 ..."
cd "$SERVER_DIR"
uvicorn app:app --host 0.0.0.0 --port 8000 --reload &
SERVER_PID=$!

# 3. Setup and Start React Client
free_port 3000

echo "[3/3] Starting React frontend client on http://localhost:3000 ..."
cd "$CLIENT_DIR"

if [ ! -d "$CLIENT_DIR/node_modules" ]; then
    echo "Installing frontend dependencies via npm install..."
    npm install
fi

npm start &
CLIENT_PID=$!

# Keep script running and wait for background processes
wait
