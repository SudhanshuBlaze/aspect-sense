# AspectSense

AspectSense is an intelligent, full-stack Aspect-Based Sentiment Analysis (ABSA) platform. It continuously scrapes customer reviews from Google Maps locations and extracts fine-grained aspects, descriptors, and sentiment polarities using open-source NLP models.

---

## Key Features

- **Continuous Background Web Scraper**: Continuously scrapes reviews for active locations non-stop and stores them in local database storage.
- **Active Locations Management**: Easily add, remove, and trigger analysis for active location presets directly from the user interface.
- **Local ABSA Intelligence**: Powered by `cardiffnlp/twitter-roberta-base-sentiment-latest` and spaCy NLP pipeline. 100% free and open-source — no OpenAI API keys required.
- **Dual Database Persistence**: Automatic fallback between MongoDB and local SQLite database (`reviews.db`).
- **Interactive UI & Visualizations**: Interactive sentiment distribution charts, aspect word clouds, searchable review tables, and real-time Server-Sent Events (SSE) streaming.

---

## Quick Start (Entire Application)

Run the unified startup script from the root directory to automatically initialize virtual environments, install dependencies, and launch both the backend server and React frontend:

### On macOS / Linux:
```bash
./start.sh
```

### On Windows (Command Prompt):
```cmd
start.bat
```

### On Windows (PowerShell):
```powershell
.\start.ps1
```

- **React Frontend**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend**: [http://localhost:8000](http://localhost:8000)
- **API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Manual Setup

### 1. Backend Server Setup

Navigate to the `server` directory:
```bash
cd server
```

Run the server setup script:
```bash
# On macOS / Linux
./start_server.sh

# On Windows
start_server.bat
```

Or setup manually:
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python -m spacy download en_core_web_lg
uvicorn app:app --reload
```

---

### 2. Frontend Client Setup

Navigate to the `client` directory:
```bash
cd client
```

Install dependencies and start the React app:
```bash
npm install
npm start
```

---

## Docker Setup

Build and run the entire application via Docker Compose:

```bash
# Build Docker containers
docker-compose build

# Start containers
docker-compose up
```

- React Client: `http://localhost:3000`
- FastAPI Server: `http://localhost:8000`

---

## API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/scrapper_pipeline?location=<name>` | Run ABSA analysis on a location |
| `GET` | `/stream_scrapper_pipeline?location=<name>` | Stream real-time ABSA analysis via SSE |
| `GET` | `/active_locations` | Get active background scraping locations & database totals |
| `POST` | `/add_active_location?location=<name>` | Add location to continuous scraping queue |
| `POST` | `/remove_active_location?location=<name>` | Remove location from continuous scraping queue |
| `GET` | `/background_scraper_logs` | Tail live background scraper logs |

---

## Disclaimer

AspectSense is intended for educational and demonstration purposes only. Scraping Google Maps reviews must comply with Google's Terms of Service.
