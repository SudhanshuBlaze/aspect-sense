from fastapi import APIRouter
from controllers import hf_absa_controller

router = APIRouter()

@router.get("/hf_absa")
def hf_absa(review: str):
    return hf_absa_controller(review)
