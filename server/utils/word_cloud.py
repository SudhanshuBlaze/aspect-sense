import pandas as pd
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import io
import base64
from typing import List, Dict

def generate_word_cloud_img(words: List[str]) -> str:
    wordcloud = WordCloud(width=800, height=800, 
                    background_color='white', 
                    stopwords=None, 
                    min_font_size=10).generate(" ".join(words))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")
    
    # Save the figure to a temporary buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    
    # Reset the figure so that it can be reused
    plt.clf()
    
    # Return the image as a binary string
    buf.seek(0)
    image_data = buf.getvalue()
    base64_image = base64.b64encode(image_data).decode("utf-8")
    return f"data:image/png;base64,{base64_image}"

def get_word_cloud(df_reviews: pd.DataFrame) -> Dict[str, str]:
    positive_words=[]
    negative_words=[]

    for inner_list in df_reviews["aspect_with_polarity"]:
        for dic in inner_list:
            if dic.get('polarity') is not None:
                if dic['polarity'] > 0 and dic.get('aspect'):
                    positive_words.append(dic['aspect'])
                elif dic['polarity'] < 0 and dic.get('aspect'):
                    negative_words.append(dic['aspect'])

    return {
        "negative_wordcloud": generate_word_cloud_img(negative_words), 
        "positive_wordcloud": generate_word_cloud_img(positive_words)
    }
