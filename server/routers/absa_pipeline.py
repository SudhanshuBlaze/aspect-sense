from fastapi import APIRouter
from utils import *

router = APIRouter()

@router.get('/')
def absa_pipeline(url:str):
    df_reviews=pipeline(url)
    json_reviews=df_reviews.to_json(orient="records")

    wordcloud_image_dict=get_word_cloud(df_reviews)
    
    response_data = {
        "reviews": json_reviews,
        "positive_wordcloud": wordcloud_image_dict["positive_wordcloud"],
        "negative_wordcloud": wordcloud_image_dict["negative_wordcloud"],
    }

    return response_data