import contractions
import spacy 

nlp=spacy.load("en_core_web_sm")

def text_process(review: str) -> str:
    """
    - Lemmatize text
    - Expand contractions (i.e don't->do not, can't->cannot)
    """
    doc=nlp(review)
    lemmatized_text_arr=[token.lemma_ for token in doc]
    lemmatized_text_str =" ".join(lemmatized_text_arr)
    
    expanded_text = contractions.fix(lemmatized_text_str, slang=True)
    return expanded_text

