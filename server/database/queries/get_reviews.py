from database.database import Database
import pandas as pd


db = Database().db


def get_reviews(location="Konark") -> pd.DataFrame:
    reviews = db[location].find()
    review_list = []
    for review in reviews:
        review_list.append(review["caption"])

    return review_list
   

