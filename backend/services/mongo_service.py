from pymongo import MongoClient
import re
from config import Config

mongo_client = None
db = None


def init_mongo():
    global mongo_client, db
    mongo_uri = Config.MONGO_URI
    print(f"MONGO_URI: {mongo_uri}")

    mongo_client = MongoClient(mongo_uri)
    db = mongo_client.get_database('auppEcampus')

    if db is not None:
        print('Mongo connected')
    else:
        print('Failed to connect to MongoDB')
