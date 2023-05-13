from fastapi import FastAPI
from pymongo import MongoClient
import spacy
from typing import List
import numpy as np



# Connection URL
url = 'mongodb://localhost:27017'
# Database Name
db_name = 'googlemaps'
# Create a new MongoClient
client = MongoClient(url)
# Connect to the MongoClient
client.server_info()  # trigger connection to ensure it's working
# Get a reference to the database
db = client[db_name]
# Get a reference to the collection
collection = db['review']


# Load spaCy model
nlp = spacy.load('en_core_web_lg')


# Create a FastAPI app instance
app = FastAPI()

# Set up the API endpoint to retrieve reviews
@app.get('/reviews/{keyword}')
async def search_reviews(keyword: str) -> List[str]:
    keyword_vec = nlp(keyword).vector
    matched_reviews = []
    for document in collection.find():
        caption = document["caption"]
        if caption is not None:
            doc = nlp(caption)
            similarity = 0
            for sent in doc.sents:
                 for token in sent:
                    token_vec = token.vector
                    similarity = token_vec.dot(keyword_vec) / (np.linalg.norm(token_vec) * np.linalg.norm(keyword_vec))
                    if similarity > 0.7:  # You can adjust the similarity threshold as needed
                        matched_reviews.append(caption)

    return matched_reviews






   


   










