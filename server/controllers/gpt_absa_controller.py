from .hf_absa_controller import hf_absa_controller

def gpt_absa_controller(review: str):
    '''
    Legacy alias for aspect-based sentiment analysis (ABSA) powered by open-source Hugging Face models.
    '''
    return hf_absa_controller(review)
