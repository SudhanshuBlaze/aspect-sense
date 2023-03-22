from utils import *

def absa_engine_controller(review:str):
    '''
    Aspect-based sentiment analysis (ABSA) of a single review using NLP technique.
    '''
    clean_review=text_process(review)
    segments=segment_review(clean_review)
    absa=analysis_with_spacy(segments)

    merged_output = []
    for i, pair in enumerate(absa[0]):
        aspect = pair['aspect']
        description = pair['description']
        polarity = absa[1][i]['polarity']
        merged_output.append({'aspect': aspect, 'descriptor': description, 'polarity': polarity})

    return merged_output