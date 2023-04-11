import time
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

options.add_argument('--disable-extensions')
options.add_argument('--disable-gpu')
options.add_argument('--disable-infobars')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-browser-side-navigation')
options.add_argument('--disable-blink-features=AutomationControlled')


# initializing the webdriver
browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def scrolling(counter):
    print('scrolling...')
    scrollable_div = browser.find_elements(by=By.XPATH, value='//div[@class="lXJj5c Hk4XGb "]')
    for _i in range(counter):
        scrolling = browser.execute_script(
            'document.getElementsByClassName("dS8AEf")[0].scrollTop = document.getElementsByClassName("dS8AEf")[0].scrollHeight',
            scrollable_div
        )
        time.sleep(3)

def counter():
    result = browser.find_element(by=By.CLASS_NAME, value='jANrlb').find_element(by=By.CLASS_NAME, value='fontBodySmall').text
    result = result.replace(',', '')
    result = result.split(' ')
    result = result[0].split('\n')
    return int(int(result[0])/10)+1

def review_scrapper(url: str) -> pd.DataFrame:
    browser.get(url)

    num_of_scrolls=counter()  # get the number of scrolls by getting the count of num of reviews
    scrolling(3)  # scroll 'n' times, you can change it to any number

    # Find all reviews
    print('getting reviews...')
    review_span = browser.find_elements(by=By.CLASS_NAME, value="wiI7pd")
    rating_span = browser.find_elements(by=By.CLASS_NAME, value="kvMYJc")

    # Code for aggregating reviews and ratings
    reviews_arr, ratings_arr= [], []
    for i in range(len(review_span)):
        if len(review_span[i].text) != 0:
            # putting reviews in reviews_arr
            reviews_arr.append(review_span[i].text)

            # putting ratings in ratings_arr
            ratings = rating_span[i].get_attribute("aria-label").split(" ")[0]

            if int(ratings) > 3:
                ratings_arr.append("Positive")
            else:
                ratings_arr.append("Negative")

    df_reviews = pd.DataFrame(list(zip(reviews_arr, ratings_arr)), columns=['reviews', 'ratings'])
    return df_reviews



if __name__ == "__main__":
    demo_url="https://www.google.co.in/maps/place/Konark+Sun+Temple/@19.8876003,86.0923477,17z/data=!4m8!3m7!1s0x3a19f2a097819bbf:0xed9983ca391e3247!8m2!3d19.8875953!4d86.0945364!9m1!1b1!16s%2Fm%2F02rd_67"

    print('starting...')
    review_scrapper(demo_url)