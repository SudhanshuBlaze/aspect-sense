from database.database import Database
import pandas as pd


db = Database().db


def get_reviews(review="review") -> pd.DataFrame:
    reviews = db[review].find()
    review_list = []
    for review in reviews:
        review_list.append(review["caption"])
    df = pd.DataFrame({"reviews": review_list})
    return df.dropna()

