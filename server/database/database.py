from pymongo import MongoClient

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            try:
                client = MongoClient("mongodb://localhost:27017/")
                cls._instance.db = client["googlemaps"]
                print("\033[95;1m\033[1ASuccessfully connected to database.\033[0m")
            except Exception as e:
                print("\033[91;1m\033[1AError connecting to database: {} {}\033[0m".format(type(e).__name__, str(e)))
        return cls._instance
