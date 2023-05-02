from pymongo import MongoClient

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            client = MongoClient("mongodb://localhost:27017/")
            cls._instance.db = client["googlemaps"]
        return cls._instance         