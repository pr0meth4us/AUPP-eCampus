from datetime import datetime, timezone
from services.mongo_service import db
from bson import ObjectId


class MajorController:
    @staticmethod
    def find_or_create_majors(major_names):
        major_ids = []
        for name in major_names:
            existing_major = db.majors.find_one({'name': name})
            if existing_major:
                major_ids.append(ObjectId(existing_major['_id']))
            else:
                major_data = {
                    'name': name,
                    'created_at': datetime.now(timezone.utc),
                    'updated_at': datetime.now(timezone.utc)
                }
                result = db.majors.insert_one(major_data)
                major_ids.append(result.inserted_id)
        return major_ids

    @staticmethod
    def get_all_majors():
        majors = list(db.majors.find())
        for major in majors:
            major['_id'] = str(major['_id'])  # Convert ObjectId to string
        return majors

    @staticmethod
    def delete_major(major_id):
        return db.majors.delete_one({'_id': ObjectId(major_id)}).deleted_count > 0

    @staticmethod
    def update_major(major_id, name):
        updated = db.majors.update_one(
            {'_id': ObjectId(major_id)},
            {'$set': {'name': name, 'updated_at': datetime.now(timezone.utc)}}
        )
        return updated.modified_count > 0
