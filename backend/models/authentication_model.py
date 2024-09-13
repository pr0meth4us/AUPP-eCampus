from pymongo import MongoClient
import os

mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb')
mongo_client = MongoClient(mongo_uri)
db = mongo_client.mydb


class Authentication:
    def __init__(self, user_id, token):
        self.user_id = user_id
        self.token = token

    def save_to_db(self):
        auth_collection = db.authentications
        auth_collection.insert_one({
            'user_id': self.user_id,
            'token': self.token
        })
