from fastapi import APIRouter
from controllers import semantic_search_controller
from typing import List


router = APIRouter()

@router.get('/semantic_search')
def semantic_search(location: str, keyword: str) -> List[str]:
    return semantic_search_controller(location, keyword)