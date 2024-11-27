from datetime import datetime, timezone
from services.mongo_service import db
from bson import ObjectId


class TagController:
    @staticmethod
    def find_or_create_tags(tag_names):
        tag_ids = []
        for name in tag_names:
            existing_tag = db.tags.find_one({'name': name})
            if existing_tag:
                tag_ids.append(ObjectId(existing_tag['_id']))
            else:
                tag_data = {
                    'name': name,
                    'created_at': datetime.now(timezone.utc),
                    'updated_at': datetime.now(timezone.utc)
                }
                result = db.tags.insert_one(tag_data)
                tag_ids.append(result.inserted_id)
        return tag_ids

    @staticmethod
    def get_all_tags():
        # Fetch tags from MongoDB and convert ObjectId to string
        tags = list(db.tags.find())
        for tag in tags:
            tag['_id'] = str(tag['_id'])  # Convert ObjectId to string
        return tags

    @staticmethod
    def delete_tag(tag_id):
        return db.tags.delete_one({'_id': ObjectId(tag_id)}).deleted_count > 0

    @staticmethod
    def update_tag(tag_id, name):
        updated = db.tags.update_one(
            {'_id': ObjectId(tag_id)},
            {'$set': {'name': name, 'updated_at': datetime.now(timezone.utc)}}
        )
        return updated.modified_count > 0
