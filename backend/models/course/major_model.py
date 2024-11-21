from datetime import datetime, timezone
from services.mongo_service import db
from bson import ObjectId


class Major:
    def __init__(self, name):
        self.name = name
        self.created_at = datetime.now(timezone.utc)

    def save_to_db(self):
        major_data = {
            'name': self.name,
            'created_at': self.created_at
        }
        result = db.majors.insert_one(major_data)
        return str(result.inserted_id)

    @staticmethod
    def get_all():
        return list(db.majors.find())

    @staticmethod
    def find_by_id(major_id):
        return db.majors.find_one({'_id': ObjectId(major_id)})
