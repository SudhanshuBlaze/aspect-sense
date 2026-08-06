from pymongo import MongoClient

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            try:
                client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
                cls._instance.db = client["googlemaps"]
            except Exception as e:
                print(f"MongoDB Connection Warning: {e}")
                cls._instance.db = None
        return cls._instance