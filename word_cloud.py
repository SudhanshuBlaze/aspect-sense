from io import BytesIO
import pandas as pd
from wordcloud import WordCloud

def wordcloud(keywords_dict):
    # df.isna().sum()
    text = " ".join(words for words in keywords_dict['keywords'])
    word_cloud = WordCloud(collocations = False, background_color = 'white').generate(text)
    
    return word_cloud
