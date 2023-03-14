from fastapi import APIRouter
import openai
import os
from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

model_engine = "text-davinci-003"
openai.api_key = os.getenv("api_key")

@router.get("/absa")
def gpt_absa(prompt: str):
    # Generate a response
    completion = openai.Completion.create(
        engine=model_engine,
        prompt=f"fetch out aspect, descriptor and polarity of each aspect from the following sentence. The polarity should be in the range of 1 to 10. {prompt}",
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    response = completion.choices[0].text
    return {"response": response}   