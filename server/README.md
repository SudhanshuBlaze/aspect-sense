# Fast API Server

## Goal

The goal of the project is to scrape google maps reviews for given location(restaurants, hospital, malls) and analyse them after translating to english

## Project Setup

### Pre-requisites

- git
- pip3

`Step 1:` Clone this repository

```bash
git clone <repository>
```

`Step 2:` Change the work dir

```bash
cd <repository>
```

`Step 3:` Run automated start script (creates `.venv`, installs dependencies, and starts server):

```bash
./start_server.sh
```

*Or manually:*

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
```

- The server will be available at http://localhost:8000.
- Runs open-source Hugging Face transformer models & spaCy locally without requiring API keys.
