from fastapi import APIRouter
from controllers import absa_pipeline_controller

router = APIRouter()

@router.get('/scrapper_pipeline')
def absa_pipeline(location:str):
    return absa_pipeline_controller(location)
    