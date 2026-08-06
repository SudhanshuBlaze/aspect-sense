#!/usr/bin/env bash
set -e

# Change directory to server folder
cd "$(dirname "$0")"

# Helper function to check and free port 8000 if occupied
pids=$(lsof -ti :8000 2>/dev/null || true)
if [ -n "$pids" ]; then
    echo "Port 8000 is occupied by PID(s): $pids. Freeing port 8000..."
    kill -9 $pids 2>/dev/null || true
    sleep 1
fi

# Create virtual environment if it does not exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment in .venv..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install/verify requirements
echo "Installing requirements inside virtual environment..."
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Ensure spaCy models are installed
python -m spacy download en_core_web_sm || true
python -m spacy download en_core_web_lg || true

# Start server in debug/reload mode inside virtual environment
echo "Starting FastAPI server on http://localhost:8000 ..."
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
