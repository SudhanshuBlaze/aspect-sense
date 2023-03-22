from fastapi import APIRouter
from controllers import absa_engine_controller

router = APIRouter()

@router.get('/spacy_absa')
def absa_engine(review:str):
    return absa_engine_controller(review)
