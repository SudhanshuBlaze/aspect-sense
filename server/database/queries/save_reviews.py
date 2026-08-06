import os
import sqlite3
import pandas as pd
from typing import List, Dict, Any
from database.database import Database

SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "reviews.db")


def init_sqlite_db():
    """Initializes local SQLite database for fallback offline storage."""
    conn = sqlite3.connect(SQLITE_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT NOT NULL,
            caption TEXT UNIQUE NOT NULL,
            segmented_reviews TEXT,
            aspect_with_description TEXT,
            aspect_with_polarity TEXT,
            scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


init_sqlite_db()


def save_reviews(location: str, reviews_df: pd.DataFrame) -> int:
    """
    Saves new non-duplicate reviews and ABSA results to MongoDB and SQLite.
    Returns the count of newly inserted review records.
    """
    if reviews_df is None or reviews_df.empty:
        return 0

    inserted_count = 0
    loc_clean = location.strip()

    # 1. Store in MongoDB if available
    try:
        db_instance = Database()
        if db_instance.db is not None:
            db_instance.db.command('ping')
            collection = db_instance.db[loc_clean]
            
            mongo_docs = []
            for _, row in reviews_df.iterrows():
                caption = str(row.get('reviews', '')).strip()
                if not caption:
                    continue
                
                # Avoid duplicate insertion
                if not collection.find_one({"caption": caption}):
                    doc = {
                        "caption": caption,
                        "segmented_reviews": row.get('segmented_reviews', []),
                        "aspect_with_description": row.get('aspect_with_description', []),
                        "aspect_with_polarity": row.get('aspect_with_polarity', [])
                    }
                    mongo_docs.append(doc)
            
            if mongo_docs:
                collection.insert_many(mongo_docs)
                inserted_count = len(mongo_docs)
                print(f"[MongoDB] Inserted {inserted_count} new reviews for '{loc_clean}'.")
    except Exception:
        pass

    # 2. Store in local SQLite database (always active fallback)
    try:
        conn = sqlite3.connect(SQLITE_DB_PATH)
        cursor = conn.cursor()
        sqlite_inserted = 0

        for _, row in reviews_df.iterrows():
            caption = str(row.get('reviews', '')).strip()
            if not caption:
                continue

            try:
                cursor.execute("""
                    INSERT OR IGNORE INTO reviews 
                    (location, caption, segmented_reviews, aspect_with_description, aspect_with_polarity)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    loc_clean,
                    caption,
                    str(row.get('segmented_reviews', [])),
                    str(row.get('aspect_with_description', [])),
                    str(row.get('aspect_with_polarity', []))
                ))
                if cursor.rowcount > 0:
                    sqlite_inserted += 1
            except Exception:
                pass

        conn.commit()
        conn.close()
        print(f"[SQLite] Stored {sqlite_inserted} new reviews for '{loc_clean}' in local SQLite DB.")
        
        if inserted_count == 0:
            inserted_count = sqlite_inserted
    except Exception as e:
        print(f"[SQLite Error] {e}")

    return inserted_count


def get_db_stats() -> Dict[str, Any]:
    """Returns database review counts per location."""
    stats = {}
    
    # Check SQLite stats
    try:
        conn = sqlite3.connect(SQLITE_DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT location, COUNT(*) FROM reviews GROUP BY location")
        rows = cursor.fetchall()
        for loc, count in rows:
            stats[loc] = count
        conn.close()
    except Exception:
        pass

    # Check MongoDB stats if available
    try:
        db_instance = Database()
        if db_instance.db is not None:
            db_instance.db.command('ping')
            for col_name in db_instance.db.list_collection_names():
                count = db_instance.db[col_name].count_documents({})
                stats[col_name] = max(stats.get(col_name, 0), count)
    except Exception:
        pass

    return stats
