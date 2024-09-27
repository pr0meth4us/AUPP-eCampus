from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

mongo_client = None
db = None


def init_mongo(app):
    global mongo_client, db
    mongo_uri = app.config['MONGO_URI']
    mongo_client = MongoClient(mongo_uri)
    db = mongo_client.get_database('auppEcampus')
    if db is not None:
        print('Mongo connected')
    else:
        print('Failed to connect to MongoDB')
