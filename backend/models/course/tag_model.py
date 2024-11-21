from services.mongo_service import db
from datetime import datetime, timezone
from bson import ObjectId


class Tag:
    def __init__(self, name):
        self.name = name
        self.created_at = datetime.now(timezone.utc)

    def save_to_db(self):
        tag_data = {
            'name': self.name,
            'created_at': self.created_at
        }
        result = db.tags.insert_one(tag_data)
        return str(result.inserted_id)

    @staticmethod
    def get_all():
        return list(db.tags.find())

    @staticmethod
    def find_by_id(tag_id):
        return db.tags.find_one({'_id': ObjectId(tag_id)})

    @staticmethod
    def find_by_name(name):
        return db.tags.find_one({'name': name})
