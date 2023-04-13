from fastapi import APIRouter
from controllers import gpt_absa_controller

router = APIRouter()

@router.get("/gpt_absa")
def gpt_absa(review: str):
    return gpt_absa_controller(review)