import pandas as pd
from utils import *
from fastapi import HTTPException

def absa_pipeline_controller(location:str):
    '''
    This endpoint performs a pipeline of operations for a given URL of a location on Google Maps. It first scrapes the reviews of the location from Google Maps using the provided URL. It then applies aspect-based sentiment analysis (ABSA) on each of the scraped reviews using a pre-trained spaCy model. The result of the ABSA is returned as a JSON object containing information on the aspects of the review and their corresponding sentiment polarity.
    '''
    try:
        df_reviews=pipeline(location)
        json_reviews=df_reviews.to_json(orient="records")

        wordcloud_image_dict=get_word_cloud(df_reviews)

        response_data = {
            "reviews": json_reviews,
            "positive_wordcloud": wordcloud_image_dict["positive_wordcloud"],
            "negative_wordcloud": wordcloud_image_dict["negative_wordcloud"],
        }

        return response_data

    except Exception as e:
        error_msg = f"An error occurred while processing the request: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)


def absa_pipeline_stream_controller(location: str):
    """
    Generator streaming Server-Sent Events (SSE) chunks containing parsed reviews and word clouds as reviews are scraped.
    """
    import json
    try:
        accumulated_dfs = []
        for df_batch in pipeline_stream(location):
            if df_batch is not None and not df_batch.empty:
                accumulated_dfs.append(df_batch)
                combined_df = pd.concat(accumulated_dfs, ignore_index=True)
                
                wordcloud_dict = get_word_cloud(combined_df)
                batch_records = json.loads(df_batch.to_json(orient="records"))

                chunk = {
                    "batch": batch_records,
                    "positive_wordcloud": wordcloud_dict.get("positive_wordcloud", ""),
                    "negative_wordcloud": wordcloud_dict.get("negative_wordcloud", "")
                }
                yield f"data: {json.dumps(chunk)}\n\n"
    except Exception as e:
        print(f"Error in stream controller: {str(e)}")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

