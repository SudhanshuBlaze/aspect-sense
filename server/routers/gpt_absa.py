from fastapi import APIRouter
import openai
from json import loads
from os import getenv
from textwrap import dedent
from dotenv import load_dotenv
load_dotenv()


router = APIRouter()

# Load OpenAI API key and model engine from environment variables
openai.api_key = getenv("OPENAI_API_KEY")
model_engine = getenv("OPENAI_MODEL_ENGINE")

ABSA_PROMPT = dedent(
        f"""
        fetch out aspect, descriptor and polarity of each aspect from the following sentence. The polarity should be in the range of 1 to 10. 
        Output format in JSON. 
        Example json format: 
        
        [{{"aspect": "food", "descriptor": "delicious", "polarity": 10}}, 
        {{"aspect": "toilets", "descriptor": "not clean", "polarity": 1}}]

        Example process of generating the above json format from a given text:

        This product is good but the battery doesn't last. It's lightweight and very easy to use. Well worth the money.
            [
            {{ "aspect": "Overall satisfaction", "segment": "This product is good", "sentiment": "positive" }},
            {{ "aspect": "Battery", "segment": "the battery doesn't last", "sentiment": "negative" }},
            {{ "aspect": "Weight", "segment": "It's lightweight", "sentiment": "positive" }},
            {{ "aspect": "Usability", "segment": "very easy to use", "sentiment": "positive" }},
            {{ "aspect": "Value for money", "segment": "Well worth the money", "sentiment": "positive" }}
            ]
        """
        )

@router.get("/gpt_absa")
def gpt_absa(review: str):
    '''
    Generates an aspect-based sentiment analysis (ABSA) response using OpenAI's GPT-3 language model.
    '''
    completion = openai.Completion.create(
        engine=model_engine,
        prompt= f"{ABSA_PROMPT} \n {review}",
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    response = completion.choices[0].text
    print(response)
    raw_json = response.strip()
    json_data = loads(raw_json)

    return json_data