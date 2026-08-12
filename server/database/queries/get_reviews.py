import os
import sqlite3
from typing import List
from database.database import Database

SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "reviews.db")


def get_reviews(location="Konark") -> List[str]:
    """
    Retrieves stored review captions from MongoDB and local SQLite DB matching 'location'.
    """
    review_list = []
    loc_clean = location.strip()

    # 1. Query MongoDB if available
    try:
        db_instance = Database()
        if db_instance.db is not None:
            db_instance.db.command('ping')
            collection = db_instance.db[loc_clean]
            reviews = collection.find()
            for review in reviews:
                if "caption" in review and review["caption"]:
                    review_list.append(review["caption"])
    except Exception:
        pass

    # 2. Query SQLite fallback DB if MongoDB returns 0 records
    if not review_list:
        try:
            if os.path.exists(SQLITE_DB_PATH):
                conn = sqlite3.connect(SQLITE_DB_PATH)
                cursor = conn.cursor()
                cursor.execute("SELECT caption FROM reviews WHERE location LIKE ?", (f"%{loc_clean}%",))
                rows = cursor.fetchall()
                for r in rows:
                    if r[0]:
                        review_list.append(r[0])
                conn.close()
        except Exception as e:
            print(f"SQLite query error: {str(e)}")

    return review_list


def get_existing_captions(location: str) -> set:
    """
    Returns a set of all review captions stored in MongoDB and SQLite for the given location.
    Used to pre-filter scraped reviews BEFORE executing ABSA.
    """
    captions = set()
    loc_clean = location.strip()
    if not loc_clean:
        return captions

    # Check MongoDB
    try:
        db_instance = Database()
        if db_instance.db is not None:
            db_instance.db.command('ping')
            collection = db_instance.db[loc_clean]
            for doc in collection.find({}, {"caption": 1}):
                c = doc.get("caption")
                if c:
                    captions.add(c.strip())
    except Exception:
        pass

    # Check SQLite
    try:
        if os.path.exists(SQLITE_DB_PATH):
            conn = sqlite3.connect(SQLITE_DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT caption FROM reviews WHERE location LIKE ?", (f"%{loc_clean}%",))
            for row in cursor.fetchall():
                if row[0]:
                    captions.add(row[0].strip())
            conn.close()
    except Exception as e:
        print(f"SQLite get_existing_captions error: {str(e)}")

    return captions
