from fastapi import APIRouter
from utils import *

router = APIRouter()

@router.get('/scrapper_pipeline')
def absa_pipeline(url:str):
    '''
    This endpoint performs a pipeline of operations for a given URL of a location on Google Maps. It first scrapes the reviews of the location from Google Maps using the provided URL. It then applies aspect-based sentiment analysis (ABSA) on each of the scraped reviews using a pre-trained spaCy model. The result of the ABSA is returned as a JSON object containing information on the aspects of the review and their corresponding sentiment polarity.
    '''
    df_reviews=pipeline(url)
    json_reviews=df_reviews.to_json(orient="records")

    wordcloud_image_dict=get_word_cloud(df_reviews)
    
    response_data = {
        "reviews": json_reviews,
        "positive_wordcloud": wordcloud_image_dict["positive_wordcloud"],
        "negative_wordcloud": wordcloud_image_dict["negative_wordcloud"],
    }

    return response_data