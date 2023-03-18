import time
from typing import List, Tuple
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager


# loads chrome driver
options = webdriver.ChromeOptions()
options.add_experimental_option('excludeSwitches', ['enable-logging'])
options.add_argument('-headless')
options.add_argument('-no-sandbox')
options.add_argument('-disable-dev-shm-usage')


# initializing the webdriver
browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)


def review_scrapper(url: str) -> pd.DataFrame:
    browser.get(url)
    num_of_reviews = browser.find_element(By.XPATH,
                                           '//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div[2]/div/div[2]/div[2]').text.split(" ")[0]

    # Find scroll layout
    scrollable_div = browser.find_element(By.XPATH, '//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]')

    # Scroll as many times as necessary to load all reviews
    num_of_scroll = round(int(num_of_reviews) / 10 - 1)
    for i in range(num_of_scroll):
        browser.execute_script('arguments[0].scrollTop = arguments[0].scrollHeight', scrollable_div)
        time.sleep(2)

    # Find all reviews
    review_span = browser.find_elements(by=By.CLASS_NAME, value="wiI7pd")
    rating_span = browser.find_elements(by=By.CLASS_NAME, value="kvMYJc")

    # Code for aggregating reviews and ratings
    reviews_arr: List[str] = []
    ratings_arr: List[str] = []
    for i in range(len(review_span)):
        if len(review_span[i].text) != 0:
            # putting reviews in reviews_arr
            reviews_arr.append(review_span[i].text)
            # putting ratings in ratings_arr
            ratings = rating_span[i].get_attribute("aria-label").split(" ")[1]
            if int(ratings) > 3:
                ratings_arr.append("Positive")
            else:
                ratings_arr.append("Negative")

    df_reviews = pd.DataFrame(list(zip(reviews_arr, ratings_arr)), columns=['reviews', 'ratings'])
    return df_reviews
