from transformers import pipeline

def text_classification(text):
    pipe = pipeline("text-classification")
    sentiment=pipe(text)
    return sentiment

def sentiment_analysis(reviews_arr):
    positive=[]
    negative=[]

    for review in reviews_arr:
        sentiment = text_classification(review)[0]['label']
        if sentiment == 'POSITIVE':
            positive.append(review)
        else:
            negative.append(review)

    sentiment_dict = {"Positive" : positive,"Negative" : negative }

    return sentiment_dict