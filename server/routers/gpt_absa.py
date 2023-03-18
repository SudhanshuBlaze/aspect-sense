from fastapi import APIRouter
import openai
from os import getenv
from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

# Load OpenAI API key and model engine from environment variables
openai.api_key = getenv("OPENAI_API_KEY")
model_engine = getenv("OPENAI_MODEL_ENGINE")

@router.get("/gpt_absa")
def gpt_absa(review: str):
    '''
    Generates an aspect-based sentiment analysis (ABSA) response using OpenAI's GPT-3 language model.
    '''
    completion = openai.Completion.create(
        engine=model_engine,
        prompt=f"fetch out aspect, descriptor and polarity of each aspect from the following sentence. The polarity should be in the range of 1 to 10. {review}" ,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    response = completion.choices[0].text
    return response