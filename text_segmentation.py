import spacy
from spacy.language import Language

#add a pipe which splits at conjunctions and separators
nlp=spacy.load("en_core_web_sm")
separators=[ ';', '!']

@Language.component("component")
def set_custom_boundaries(doc):
  for token in doc[:-1]:
    if token.text in separators or token.tag_ == 'CC':
      doc[token.i+1].is_sent_start = True
  return doc

nlp.add_pipe("component", before='parser')
# nlp.pipe_names

#function to segment text
def segment_review(review):
  segmented_neg_reviews=[]
  doc=nlp(str(review))
  for sent in doc.sents:
    segmented_neg_reviews.append(sent.text)
  return segmented_neg_reviews