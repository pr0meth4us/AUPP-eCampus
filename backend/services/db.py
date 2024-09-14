from pymongo import MongoClient
import os

# MongoDB configuration
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb')
mongo_client = MongoClient(mongo_uri)
db = mongo_client.mydb