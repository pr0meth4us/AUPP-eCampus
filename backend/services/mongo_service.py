from pymongo import MongoClient

mongo_client = None
db = None


def init_mongo(app):
    global mongo_client, db
    mongo_uri = app.config['MONGO_URI']
    mongo_client = MongoClient(mongo_uri)
    db = mongo_client.mydb
