from keybert import KeyBERT

def keyword_extracting_function(text):
    kw_model = KeyBERT()
    keywords=kw_model.extract_keywords(docs=text,stop_words='english')
    return keywords

def keyword_extraction(sentiment_analysis_dict):
    keywords_of_reviews=[]
    for i in sentiment_analysis_dict['Positive']:
        if i!="":
            keywords = keyword_extracting_function(i)

        if len(keywords)!=0:
            for tuples in keywords:
                keywords_of_reviews.append(tuples[0]) 


    for i in sentiment_analysis_dict['Negative']:
        if i!="":
            keywords = keyword_extracting_function(i)
        
        if len(keywords)!=0:
            for tuples in keywords:
                keywords_of_reviews.append(tuples[0])

    keyword_dict = {"keywords" : keywords_of_reviews }

    return keyword_dict