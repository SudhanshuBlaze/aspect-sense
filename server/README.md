# Fast API Server

## Goal

The goal of the project is to scrape google maps reviews for given location(restaurants, hospital, malls) and analyse them after translating to english

## Project Setup

### Pre-requisites

- git
- pip3
- docker desktop

`Step 1:` Clone this repository

```bash
git clone <repository>
```

`Step 2:` Change the work dir

```bash
cd <repository>
```

`Step 3:` Install requirements

```bash
pip3 install -r requirements.txt
```

`Step 4:` Add API key

- Generate OpenAI api key from [OpenAI](https://openai.com/api/)
- Create `.env` file in the server directory
- Add api key in the below format
- `OPENAI_API_KEY=<your_api_key>`
- `OPENAI_MODEL_ENGINE=<your_model_engine>`

`Step 5:` Start MongoDB in the docker container

```bash
docker-compose -f mongodb-docker.yml up -d
```

`Step 6:` Run the server in debug mode

```bash
uvicorn app:app --debug
```

- The server should be available at http://localhost:8000.
