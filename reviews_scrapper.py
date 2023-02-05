from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
from fastapi import FastAPI, Response
from aspect_extraction import analysis_with_spacy
from sentiment_analysis import sentiment_analysis
from keyword_extraction import keyword_extraction
from text_cleaner import text_process
from text_segmentation import segment_review
from word_cloud import wordcloud
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pandas as pd
import spacy



app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# loads chrome driver
options = webdriver.ChromeOptions()
options.add_experimental_option('excludeSwitches', ['enable-logging'])
options.add_argument('-headless')
options.add_argument('-no-sandbox')
options.add_argument('-disable-dev-shm-usage')

# url of the location on google maps, whose review needs to be scrapped
url="https://www.google.com/maps/place/State+Bank+Of+India/@22.2558208,84.8882918,16.67z/data=!4m7!3m6!1s0x3a201c2a222c256b:0xd43e5ebc8e9da67b!8m2!3d22.2552897!4d84.8935059!9m1!1b1"

# initializing the webdriver
browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()),options=options)

@app.get('/')
def reviews():

    browser.get(url)

    num_of_reviews=browser.find_element(By.XPATH,'//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/div[2]').text.split(" ")[0]
   
    #Find scroll layout
    scrollable_div = browser.find_element(By.XPATH,'//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]')

    #Scroll as many times as necessary to load all reviews
    num_of_scroll=round(int(num_of_reviews)/10 - 1)
    for i in range(num_of_scroll):
        browser.execute_script('arguments[0].scrollTop = arguments[0].scrollHeight', 
                scrollable_div)
        time.sleep(2)

    #Find all reviews
    review_span = browser.find_elements(by=By.CLASS_NAME,value="wiI7pd")
    rating_span = browser.find_elements(by=By.CLASS_NAME,value="kvMYJc")
    
    #code for aggregating reviews and ratings
    reviews_arr=[]
    ratings_arr=[]
    for i in range(len(review_span)):
          if len(review_span[i].text)!=0:
                  #putting reviews in reviews_arr
                  reviews_arr.append(review_span[i].text)
                  #putting ratings in ratings_arr
                  ratings=rating_span[i].get_attribute("aria-label").split(" ")[1]
                  if int(ratings)>3:
                          ratings_arr.append("Positive")
                  else:
                          ratings_arr.append("Negative")


    df_reviews = pd.DataFrame(list(zip(reviews_arr, ratings_arr)),columns =['reviews', 'ratings'])

#--------------------------------------------------------------------------------------------------#
    #Code for cleaning the reviews
    df_reviews['reviews']=df_reviews['reviews'].apply(text_process)
    print(reviews_arr[3])
    print(df_reviews['reviews'][3])

#--------------------------------------------------------------------------------------------------#
    #code for text segmentation
    if type(df_reviews)!=pd.core.frame.DataFrame:
        df_reviews=df_reviews.to_frame()
    

    df_reviews["segmented_reviews"]=df_reviews['reviews'].apply(segment_review)
    print(df_reviews.head())

#--------------------------------------------------------------------------------------------------#
    #code for aspect,descriptor and sentiment extraction
    aspect_with_description=[]
    aspect_with_polarity=[]

    for each_tuple in df_reviews['segmented_reviews'].apply(analysis_with_spacy):
        aspect_with_description.append(each_tuple[0])
        aspect_with_polarity.append(each_tuple[1])

    #add new columns with aspects
    df_reviews['aspect_with_description']=aspect_with_description
    df_reviews['aspect_with_polarity']=aspect_with_polarity
    print(df_reviews.head())
    print(df_reviews['aspect_with_description'])
    print(df_reviews['aspect_with_polarity'])
#--------------------------------------------------------------------------------------------------#
    # #code for classifying reviews into positive or negative
    # positive=[]
    # negative=[]
    
    # for i in range(len(ratings_arr)):
    #     if ratings_arr[i]=="Positive":
    #         positive.append(reviews_arr[i])
    #     else:
    #         negative.append(reviews_arr[i])

    # sentiment_dict = {"Positive" : positive,"Negative" : negative }
    
    # #keyword extraction
    # keywords_dict = keyword_extraction(sentiment_dict)

    # # word_cloud = wordcloud(keywords_dict)


    # # img = BytesIO()
    # # print(type(img))
    # # word_cloud.to_image().save(img, 'PNG')
    # # img.seek(0)
    # # return Response(content=img, media_type="image/png")
    # return keywords_dict

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, debug=True)
