# Server Dockerfile for AspectSense FastAPI Backend
FROM python:3.10-slim

# Prevent Python bytecode generation & enable stdout unbuffering
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies & Chromium for Selenium headless web scraping
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    chromium-driver \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# Pre-download spaCy NLP models
RUN python -m spacy download en_core_web_sm \
    && python -m spacy download en_core_web_lg

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
