import spacy
from typing import List
import numpy as np
from database.database import Database
from fastapi import APIRouter
from fastapi import HTTPException


router = APIRouter()

db = Database().db

# Load spaCy model
nlp = spacy.load('en_core_web_lg')

def semantic_search_controller(location: str, keyword: str) -> List[str]:
    try:
        collection = db[location]
        keywords = keyword.split()  # Split the input keyword into multiple keywords
        keyword_vecs = [nlp(k).vector for k in keywords]  # Get the vectors for each keyword
        matched_reviews = []
        for document in collection.find():
            caption = document["caption"]
            if caption is not None:
                doc = nlp(caption)
                similarity = 0
                for sent in doc.sents:
                    for token in sent: 
                        token_vec = token.vector
                        for keyword_vec in keyword_vecs:
                            similarity = token_vec.dot(keyword_vec) / (np.linalg.norm(token_vec) * np.linalg.norm(keyword_vec))
                            if similarity > 0.7:  # You can adjust the similarity threshold as needed
                                matched_reviews.append(caption)

        return matched_reviews


    except Exception as e:
            error_msg = f"An error occurred while parsing the reviews: {str(e)}"
            raise HTTPException(status_code=500, detail=error_msg)
