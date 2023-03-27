from fastapi import APIRouter
from controllers import absa_pipeline_controller

router = APIRouter()

@router.get('/scrapper_pipeline')
def absa_pipeline(url:str):
    return absa_pipeline_controller(url)
    