import spacy
from typing import List, Dict, Any
from fastapi import HTTPException
from textblob import TextBlob
from utils import text_process, segment_review, analysis_with_spacy

# Global reference for lazy loading HuggingFace pipeline
_hf_sentiment_pipeline = None

def get_sentiment_pipeline():
    global _hf_sentiment_pipeline
    if _hf_sentiment_pipeline is None:
        try:
            from transformers import pipeline
            # Load lightweight, high-performance open-source sentiment analysis model
            _hf_sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                tokenizer="cardiffnlp/twitter-roberta-base-sentiment-latest"
            )
        except Exception as e:
            print(f"Warning: Could not load Hugging Face pipeline ({str(e)}). Falling back to spaCy/TextBlob.")
            _hf_sentiment_pipeline = False
    return _hf_sentiment_pipeline

def calculate_polarity_score(text: str, fallback_polarity: float) -> float:
    """
    Computes a 1 to 10 polarity score for a given text segment using Hugging Face transformer
    if available, otherwise falls back to TextBlob scaling.
    """
    pipe = get_sentiment_pipeline()
    if pipe:
        try:
            result = pipe(text)[0]
            label = result['label'].lower()
            score = result['score']

            if label == 'positive':
                polarity = 5.0 + (score * 5.0)
            elif label == 'negative':
                polarity = 5.0 - (score * 4.0)
            else: # neutral
                polarity = 5.0
            return round(min(max(polarity, 1.0), 10.0), 1)
        except Exception:
            pass

    # Fallback: Scale TextBlob [-1.0, 1.0] to [1.0, 10.0]
    scaled = (fallback_polarity + 1.0) * 4.5 + 1.0
    return round(min(max(scaled, 1.0), 10.0), 1)

def hf_absa_controller(review: str) -> List[Dict[str, Any]]:
    """
    Aspect-based sentiment analysis (ABSA) of a review using open-source Hugging Face models & spaCy.
    Returns JSON array formatted as [{"aspect": "...", "descriptor": "...", "polarity": 1-10}].
    """
    try:
        clean_review = text_process(review)
        segments = segment_review(clean_review)
        absa_results = analysis_with_spacy(segments)

        aspects_info, polarity_info = absa_results[0], absa_results[1]
        merged_output = []

        for i, item in enumerate(aspects_info):
            aspect = item.get('aspect')
            descriptor = item.get('description')
            category = item.get('category', 'General')
            tb_polarity = polarity_info[i].get('polarity', 0.0) if i < len(polarity_info) else 0.0

            if aspect and descriptor:
                segment_text = segments[i] if i < len(segments) else f"{aspect} is {descriptor}"
                polarity_score = calculate_polarity_score(segment_text, tb_polarity)
                merged_output.append({
                    'aspect': aspect,
                    'descriptor': descriptor,
                    'category': category,
                    'polarity': polarity_score
                })

        return merged_output

    except Exception as e:
        error_msg = f"An error occurred while generating the Hugging Face ABSA response: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)

