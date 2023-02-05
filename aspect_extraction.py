from textblob import TextBlob
import spacy
nlp=spacy.load("en_core_web_sm")

def get_aspect(doc):
    aspect = ''
    for token in doc:
        if token.dep_ == 'nsubj' and token.pos_ == 'NOUN':
              aspect = token.text
    return aspect

def get_descriptor(doc):
    descriptive_term = ''
    for i,token in enumerate(doc):
        if token.pos_ == 'ADJ':
            prepend = ''
            for child in token.children:
                if child.pos_ == 'ADV':
                    prepend += child.text + ' ' #Ex: not very good
            
            negation=""
            for t in range(i,0,-1):
                    try:
                        if doc[i-t].dep_ == 'neg':
                            negation = doc[i-t].text+' '
                    except:
                        continue
            descriptive_term = negation+ prepend + token.text
    return descriptive_term

def get_polarity(segment):
    """
    Predict the polarity of the text using TextBlob.
    Results range from negative to positive on a scale of [-1, +1].
    """
    polarity=round(TextBlob(segment).sentiment.polarity, 2)
    return polarity

# get_polarity("architecture is not very great")

def analysis_with_spacy(reviews_list):
    aspects = []
    polarities=[]
    for segment in reviews_list:
        doc = nlp(segment)
        
        #Use TextBlob to get sentiments
        polarity=get_polarity(segment)

        #extract aspect
        aspect=get_aspect(doc)  
        
        #extract descriptor
        descriptive_term=get_descriptor(doc)
        
        if aspect!="" and descriptive_term!="":
            aspects.append({'aspect': aspect,'description': descriptive_term})
            polarities.append({'aspect': aspect,'polarity': polarity})
        else:
            aspects.append({'aspect': None,'description': None})
            polarities.append({'aspect': None,'polarity': None})
            
    return aspects,polarities