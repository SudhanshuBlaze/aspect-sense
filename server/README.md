# Reviews analyser

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

`Step 3:` Install requirements

```bash
pip3 install -r requirements.txt
```

`Step 4:` Add API key

- Generate OpenAI api key from [OpenAI](https://openai.com/api/)
- Create .env file in the server directory
- Add api key in the below format
- api_key=<your_api_key>

`Step 4:` Run the server in debug mode

```bash
uvicorn app:app --debug
```
