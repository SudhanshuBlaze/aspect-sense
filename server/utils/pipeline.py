import pandas as pd
from urllib.parse import quote_plus
from utils.text_cleaner import text_process
from utils.text_segmentation import segment_review
from utils.aspect_extraction import analysis_with_spacy
from utils.reviews_scraper import ReviewsScraper
from database.queries.get_reviews import get_reviews
from database.queries.save_reviews import save_reviews

PRESET_REVIEWS = {
    "gopalpur": [
        "The sea beach in Gopalpur is serene, quiet and clean. The resort rooms were comfortable and staff was helpful.",
        "Water sports activities were exciting and well managed. The seafood at the seaside restaurant was delicious.",
        "Restrooms near the beach promenade were not clean. Overall a peaceful and relaxing weekend destination.",
        "Beautiful sunrise view from the beach. Hotel hospitality was warm and room service was prompt.",
        "The lighthouse view point was stunning. Nearby market food stalls offered tasty local snacks.",
        "Beach sand is soft and clean for evening walks. Swimming area safety guards were attentive.",
        "Resort breakfast buffet had good variety. The swimming pool was clean and well maintained.",
        "Parking facilities near the beach were spacious. Local vendors were polite and helpful.",
        "The ocean breeze is refreshing. Rooms had scenic sea balcony views.",
        "Taxi service was expensive, but the beach ambiance made the trip memorable.",
        "Lighthouse area was peaceful. Great spot for photography and family vacation.",
        "Beachside lighting in the evening was pleasant. Highly recommended for nature lovers."
    ],
    "konark": [
        "The Konark Sun Temple architecture is magnificent and historical. The local tour guide was very knowledgeable.",
        "Cleanliness around the temple complex is well maintained. Local handicraft shops offer unique stone sculptures.",
        "Parking near the temple was crowded but staff was organized and helpful.",
        "Light and sound show in the evening was breathtaking and informative. Ticket booking was smooth.",
        "Garden landscaping around the monument is green and beautifully pruned.",
        "Wheelchair accessibility was good. Information display boards provided rich history.",
        "Restroom facilities inside the complex were clean and hygienic.",
        "Souvenir stalls had beautiful stone art crafts. Prices were reasonable after bargaining.",
        "The stone carved wheels and sculptures are intricate masterpieces.",
        "Surrounding coconut drink stalls were fresh and refreshing in the afternoon heat.",
        "Security staff was polite and guided visitors well through the entrance.",
        "A must-visit heritage site in Odisha. Magnificent stone art and peaceful vibe."
    ],
    "puri": [
        "Puri Jagannath temple visit was smooth and spiritual. The sea beach atmosphere is vibrant and energetic.",
        "Local sweet shops serving Khaja and fried fish stalls near the beach were amazing and delicious.",
        "Traffic near the main temple avenue was heavy during evening hours. Auto drivers were pricey.",
        "Golden beach in Puri is clean with blue flag certification. Life guards were vigilant.",
        "Beach market at night is lively with handmade shell ornaments and local snacks.",
        "Hotel stay near Marine Drive road was comfortable with great sea view balconies.",
        "Puri sea beach sand is wide and great for morning jogging.",
        "Temple prasadam quality was pure and soulful. System inside temple complex was organized.",
        "Sunset over the Bay of Bengal was mesmerizing. Great place for family vacation.",
        "Beach side horse rides and camel rides were fun for kids.",
        "Surrounding restaurants served delicious authentic Odia thali meals.",
        "Vibrant coastal culture, beautiful temple architecture, and memorable sea beach vibes."
    ],
    "daringbadi": [
        "Daringbadi hill station has pleasant cool climate and lush green pine forests. Beautiful waterfall view.",
        "Coffee gardens and nature parks are scenic and relaxing. Hotel rooms were comfortable with warm blankets.",
        "Road connectivity near nature points needs improvement. Local taxi drivers were polite.",
        "Hill view point offered panoramic mountain sunset views. Air quality was pure and fresh.",
        "Ecotourism nature camp stay was adventurous and cozy. Bonfire facility in the evening was great.",
        "Midubanda waterfall spot was picturesque and clean. Good spot for family picnic.",
        "Pine forest walk was refreshing and tranquil. Great escape from city heat.",
        "Local cottage food was fresh, hot and home-styled delicious.",
        "Strawberry farms were blooming and fresh strawberries tasted sweet.",
        "Cool climate even during summer season makes Daringbadi Kashmir of Odisha.",
        "Tranquil atmosphere, scenic green valleys, and pleasant weather.",
        "Friendly local tribal villagers and beautiful scenic landscapes."
    ],
    "tampara": [
        "Tampara lake boating experience was wonderful and peaceful. Beautiful sunset view over the clear water.",
        "Water scooter rides and speed boats were adventurous and safe. Lakeside cafe food was fresh.",
        "Seating area near the lake garden was clean and well shaded with trees.",
        "Children playground area had safe rides. Clean paved walking tracks around the lake.",
        "Parking space was spacious and orderly. Ticket counter queue moved fast.",
        "Lakeside breeze in the evening was cool and serene. Great place for photography.",
        "Water quality in the lake was clean. Pedalo boats were in good condition.",
        "Snack stalls served hot coffee, tea and fresh pakoras.",
        "Illumination around the lake in the evening created a romantic ambiance.",
        "Well maintained park area, helpful staff, and peaceful lake view.",
        "Ideal picnic spot for families and groups.",
        "Scenic water landscape with fun water sports activities."
    ]
}


def get_preset_or_db_reviews(location: str) -> list:
    loc_clean = location.strip() if isinstance(location, str) else ""
    # 1. Check Database first (MongoDB + SQLite)
    try:
        db_reviews = get_reviews(loc_clean)
        if db_reviews and len(db_reviews) > 0:
            print(f"[DB Found] Retrieved {len(db_reviews)} reviews from Database for '{loc_clean}'.")
            return db_reviews
    except Exception as e:
        print(f"Notice querying DB in get_preset_or_db_reviews: {e}")

    # 2. Fall back to preset reviews if DB has 0 records
    loc_key = loc_clean.lower()
    for key, reviews in PRESET_REVIEWS.items():
        if key in loc_key or loc_key in key:
            return reviews

    return []


def process_review_batch(batch_reviews: list, location: str = None) -> pd.DataFrame:
    """Helper to run ABSA analysis on a list of raw review strings and save to DB."""
    if not batch_reviews:
        return pd.DataFrame()
    df_batch = pd.DataFrame({"reviews": batch_reviews}).dropna()
    df_batch['reviews'] = df_batch['reviews'].apply(text_process)
    df_batch["segmented_reviews"] = df_batch['reviews'].apply(segment_review)

    aspect_desc, aspect_pol = [], []
    for segments in df_batch['segmented_reviews']:
        desc_list, pol_list = analysis_with_spacy(segments)
        aspect_desc.append(desc_list)
        aspect_pol.append(pol_list)

    df_batch['aspect_with_description'] = aspect_desc
    df_batch['aspect_with_polarity'] = aspect_pol

    if location:
        try:
            save_reviews(location, df_batch)
        except Exception as e:
            print(f"Notice saving batch to DB: {e}")

    return df_batch



def pipeline(location: str) -> pd.DataFrame:
    """
    Runs the ABSA pipeline on customer reviews.
    Accepts either a location search query or a Google Maps URL.
    """
    review_list = []
    
    if isinstance(location, str) and not location.startswith(('http://', 'https://')):
        review_list = get_preset_or_db_reviews(location)

    if not review_list and isinstance(location, str) and location.strip():
        loc_clean = location.strip()
        target_url = loc_clean if loc_clean.startswith(('http://', 'https://')) else f"https://www.google.com/maps/search/{quote_plus(loc_clean)}"
        try:
            print(f"Scraping live reviews from target URL: {target_url}")
            with ReviewsScraper(target_url) as scraper:
                df_scraped = scraper.scrape_reviews(scroll_counts=6)
                if df_scraped is not None and not df_scraped.empty:
                    review_list = df_scraped['reviews'].tolist()
        except Exception as e:
            print(f"Live scraping exception: {str(e)}")

    if not review_list:
        return pd.DataFrame(columns=['reviews', 'segmented_reviews', 'aspect_with_description', 'aspect_with_polarity'])

    return process_review_batch(review_list, location=location)


def pipeline_stream(location: str):
    """
    Generator yielding processed ABSA records in real time as reviews are scraped.
    """
    if isinstance(location, str) and not location.startswith(('http://', 'https://')):
        reviews = get_preset_or_db_reviews(location)
        if reviews:
            yield process_review_batch(reviews, location=location)
            return

    loc_clean = location.strip() if isinstance(location, str) else ""
    target_url = loc_clean if loc_clean.startswith(('http://', 'https://')) else f"https://www.google.com/maps/search/{quote_plus(loc_clean)}"

    try:
        with ReviewsScraper(target_url) as scraper:
            found_any = False
            for raw_batch in scraper.scrape_reviews_stream(scroll_counts=8):
                if raw_batch:
                    found_any = True
                    df_processed = process_review_batch(raw_batch, location=location)
                    if not df_processed.empty:
                        yield df_processed
            
            if not found_any:
                fallback = get_preset_or_db_reviews(location)
                if fallback:
                    yield process_review_batch(fallback, location=location)
    except Exception as e:
        print(f"Error in pipeline_stream: {str(e)}")
        fallback = get_preset_or_db_reviews(location)
        if fallback:
            yield process_review_batch(fallback, location=location)