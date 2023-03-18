import spacy
from spacy.language import Language
from typing import List

# Load the English language model
nlp = spacy.load("en_core_web_sm")

# Define the characters that should be treated as sentence separators
separators = [';', '!']

# Define a custom pipeline component to set sentence boundaries
@Language.component("set_custom_boundaries")
def set_custom_boundaries(doc):
    for token in doc[:-1]:
        if token.text in separators or token.tag_ == 'CC':
            doc[token.i+1].is_sent_start = True
    return doc

# Add the custom pipeline component before the parser
nlp.add_pipe("set_custom_boundaries", before='parser')


def segment_review(review: str) -> List[str]:
    # Apply the language model to the review and extract the sentences
    doc = nlp(str(review))
    segmented_reviews = [sent.text for sent in doc.sents]
    return segmented_reviews

