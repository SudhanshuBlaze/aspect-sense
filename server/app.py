from fastapi import FastAPI
# from keyword_extraction import keyword_extraction
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pandas as pd
from fastapi.responses import HTMLResponse
from utils import *
import os
import openai
from dotenv import load_dotenv
load_dotenv()

model_engine = "text-davinci-003"
openai.api_key = os.getenv("api_key")

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url="https://www.google.com/maps/place/State+Bank+Of+India/@22.2558208,84.8882918,16.67z/data=!4m7!3m6!1s0x3a201c2a222c256b:0xd43e5ebc8e9da67b!8m2!3d22.2552897!4d84.8935059!9m1!1b1"

def pipeline(url):
    df_reviews=review_scrapper(url)
    
    df_reviews['reviews']=df_reviews['reviews'].apply(text_process) #cleaning the reviews

    if type(df_reviews)!=pd.core.frame.DataFrame:
        df_reviews=df_reviews.to_frame()
    

    df_reviews["segmented_reviews"]=df_reviews['reviews'].apply(segment_review) #segmenting the reviews
    print(df_reviews.head())

    aspect_with_description=[]
    aspect_with_polarity=[]

    for each_tuple in df_reviews['segmented_reviews'].apply(analysis_with_spacy): #aspect, descriptor and polarity extraction
        aspect_with_description.append(each_tuple[0])
        aspect_with_polarity.append(each_tuple[1])

    #add new columns with aspects
    df_reviews['aspect_with_description']=aspect_with_description
    df_reviews['aspect_with_polarity']=aspect_with_polarity
    print(df_reviews.head())
    print(df_reviews['aspect_with_description'])
    print(df_reviews['aspect_with_polarity'])
    return df_reviews    

@app.get('/')
def reviews(url:str):
    df_reviews=pipeline(url)
    json_reviews=df_reviews.to_json(orient="records")

    wordcloud_image_dict=get_word_cloud(df_reviews)
    
    response_data = {
        "reviews": json_reviews,
        "positive_wordcloud": wordcloud_image_dict["positive_wordcloud"],
        "negative_wordcloud": wordcloud_image_dict["negative_wordcloud"],
    }

    return response_data

@app.get("/absa")
async def absa(prompt: str):
    # Generate a response
    completion = openai.Completion.create(
        engine=model_engine,
        prompt=f"fetch out aspect, descriptor and polarity of each aspect from the following sentence.{prompt}",
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    response = completion.choices[0].text
    return {"response": response}    


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, debug=True)
