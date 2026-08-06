# AspectSense - FastAPI Backend Server

The backend server for AspectSense is built with FastAPI, Selenium WebDriver, spaCy, Hugging Face Transformers, and SQLite/MongoDB persistence.

---

## Features

- **Google Maps Review Scraper**: Headless Chrome scraper with cookie consent handling, search navigation, and direct reviews feed extraction.
- **Aspect-Based Sentiment Analysis**: Fine-grained sentiment tagging using Hugging Face (`cardiffnlp/twitter-roberta-base-sentiment-latest`) and spaCy NLP.
- **Continuous Scraper Manager**: Background thread manager continuously scraping preset and custom active locations.
- **Dual DB Storage**: Auto-fallback between MongoDB and local SQLite database (`reviews.db`).

---

## Setup & Running

### Using Startup Scripts (Recommended)

```bash
# On macOS / Linux:
./start_server.sh

# On Windows:
start_server.bat
```

### Manual Installation

```bash
# 1. Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 2. Install requirements
pip install -r requirements.txt

# 3. Download required spaCy models
python -m spacy download en_core_web_sm
python -m spacy download en_core_web_lg

# 4. Start Uvicorn development server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

---

## Interactive API Documentation

Once running, access the interactive OpenAPI documentation at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
