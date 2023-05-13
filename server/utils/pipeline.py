import pandas as pd
from utils import *
from database.queries.get_reviews import get_reviews


def pipeline(url: str) -> pd.DataFrame:
    # scraper=ReviewsScraper(url)
    # df_reviews=scraper.scrape_reviews()
    df_reviews=get_reviews()
    
    df_reviews['reviews']=df_reviews['reviews'].apply(text_process) #cleaning the reviews

    df_reviews["segmented_reviews"]=df_reviews['reviews'].apply(segment_review) #segmenting the reviews
    print(df_reviews.head())

    aspect_with_description, aspect_with_polarity=[], []

    for each_tuple in df_reviews['segmented_reviews'].apply(analysis_with_spacy): #aspect, descriptor and polarity extraction
        aspect_with_description.append(each_tuple[0])
        aspect_with_polarity.append(each_tuple[1])

    #add new columns with aspects
    df_reviews['aspect_with_description']=aspect_with_description
    df_reviews['aspect_with_polarity']=aspect_with_polarity

    return df_reviews