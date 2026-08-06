# AspectSense

AspectSense is a web-based aspect-based sentiment analysis tool that scrapes customer reviews from a Google Maps URL and displays the results on a client-side user interface.

## Goals

The main goal of AspectSense is to provide a user-friendly interface to analyze customer reviews of a particular business or location. The tool extracts aspects, descriptors, and polarity of the customer reviews and presents them in an easily readable format. This information can be useful for businesses to understand customer opinions and make improvements to their offerings.

![Image](https://media.springernature.com/lw685/springer-static/image/art%3A10.1007%2Fs11042-022-13023-7/MediaObjects/11042_2022_13023_Fig1_HTML.png)
Image Credits: [Springer](https://link.springer.com/article/10.1007/s11042-022-13023-7)

## Project Setup

### Pre-requisites

- git
- pip3
- node

`Step 1:` Clone this repository

```bash
git clone <repository>
```

`Step 2:` Change the work dir

```bash
### Quick Start (Entire Application)

Run the unified startup script from the root directory to initialize virtual environments, install dependencies, and launch both the backend server and React frontend automatically:

#### On macOS / Linux:
```bash
./start.sh
```

#### On Windows (Command Prompt):
```cmd
start.bat
```

#### On Windows (PowerShell):
```powershell
.\start.ps1
```

- **Backend FastAPI Server**: `http://localhost:8000`
- **React Frontend Client**: `http://localhost:3000`

---

### Manual Setup

#### Server Setup

`Step 1:` Navigate to the `/server` directory:

```bash
cd server
```

`Step 2:` Run setup & start script (automatically creates `.venv`, installs requirements, and launches server):

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
- **Note**: AspectSense runs completely offline with free, open-source models (Hugging Face Transformers / spaCy). No OpenAI API keys are required.

### Client Setup

`Step 1:` Navigate to the /client directory:

```bash
cd client
```

`Step 2:`install the dependencies:

```bash
npm install
```

`Step 3:` Start the React client by navigating to the /client directory and running

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
