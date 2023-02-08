# AspectSense

AspectSense is a web-based aspect-based sentiment analysis tool that scrapes customer reviews from a Google Maps URL and displays the results on a client-side user interface.

## Goals

The main goal of AspectSense is to provide a user-friendly interface to analyze customer reviews of a particular business or location. The tool extracts aspects, descriptors, and polarity of the customer reviews and presents them in an easily readable format. This information can be useful for businesses to understand customer opinions and make improvements to their offerings.

## Project Setup

- Clone the repository to your local machine:

```bash
git clone https://github.com/SudhanshuBlaze/AspectSense.git
```

### Server Setup

- Navigate to the /server directory and install the dependencies:

```bash
pip install -r requirements.txt
```

- Start the FastAPI server by navigating to the /server directory and running

- Generate OpenAI api key from [OpenAI](https://openai.com/api/)

```bash
uvicorn main:app --reload.
```

- The server should be available at http://localhost:8000.

### Client Setup

- Navigate to the /client directory and install the dependencies:

```bash
npm install
```

- Start the React client by navigating to the /client directory and running

```bash
npm start
```
- The client should be available at http://localhost:3000.

## Project Setup with Docker

- Navigate to the root directory of the project and build the Docker images:

```bash
docker-compose build
```

- Start the containers:

```bash
docker-compose up
```

The React client should be available at http://localhost:3000 and the FastAPI server should be available at http://localhost:8000.

## Usage

To use AspectSense, enter a Google Maps URL in the input field and click the "Submit" button. The tool will scrape customer reviews from the URL and display the results in a table format. The table includes columns for the customer reviews, ratings, segmented reviews, aspects with descriptions, and aspects with polarity.

**Note**: The tool is intended for educational and demonstration purposes only. The scraping of customer reviews from Google Maps may be against Google's terms of service, so use this tool at your own risk.
