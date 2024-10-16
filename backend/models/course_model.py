from datetime import datetime, UTC

from bson import ObjectId

from services.mongo_service import db


class Course:
    def __init__(self, title, description, instructor_id, video_url, uploader_id, thumbnail_url, major_ids, tag_ids):
        self.title = title
        self.description = description
        self.instructor_id = ObjectId(instructor_id)
        self.uploader_id = ObjectId(uploader_id)
        self.video_url = video_url
        self.thumbnail_url = thumbnail_url
        self.major_ids = [ObjectId(mid) for mid in major_ids]
        self.tag_ids = [ObjectId(tid) for tid in tag_ids]
        self.created_at = datetime.now(UTC)
        self.updated_at = datetime.now(UTC)

    @staticmethod
    def get_all():
        return db.courses.find()

    def save_to_db(self):
        course_data = {
            'title': self.title,
            'description': self.description,
            'instructor_id': self.instructor_id,
            'uploader_id': self.uploader_id,
            'video_url': self.video_url,
            'thumbnail_url': self.thumbnail_url,
            'major_ids': self.major_ids,
            'tag_ids': self.tag_ids,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.courses.insert_one(course_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_id(course_id):
        return db.courses.find_one({'_id': ObjectId(course_id)})

    @staticmethod
    def update_course(course_id, **kwargs):
        kwargs['updated_at'] = datetime.now(UTC)
        result = db.courses.update_one({'_id': ObjectId(course_id)}, {'$set': kwargs})
        if result.modified_count == 0:
            raise ValueError("Course not found or no changes made.")

    @staticmethod
    def delete_course(course_id):
        result = db.courses.delete_one({'_id': ObjectId(course_id)})
        if result.deleted_count == 0:
            raise ValueError("Course not found.")
class BaseModel:
    COLLECTION = None

    def __init__(self, name, _id=None, created_at=None, updated_at=None):
        self._id = ObjectId(_id) if _id else None
        self.name = name
        self.created_at = created_at if created_at else datetime.now(UTC)
        self.updated_at = updated_at if updated_at else datetime.now(UTC)

    def to_dict(self):
        return {
            'name': self.name,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    def save_to_db(self):
        if not self._id:
            existing_record = db[self.COLLECTION].find_one({'name': self.name})
            if existing_record:
                self._id = existing_record['_id']
                return str(self._id)

            result = db[self.COLLECTION].insert_one(self.to_dict())
            self._id = result.inserted_id
        else:
            self.updated_at = datetime.now(UTC)
            db[self.COLLECTION].update_one({'_id': self._id}, {'$set': self.to_dict()})
        return str(self._id)

    @classmethod
    def find_by_id(cls, record_id):
        record_data = db[cls.COLLECTION].find_one({'_id': ObjectId(record_id)})
        return cls(**record_data) if record_data else None

    @classmethod
    def get_all(cls):
        records = db[cls.COLLECTION].find()
        return [cls(**record) for record in records]


class Major(BaseModel):
    COLLECTION = 'majors'


class Tag(BaseModel):
    COLLECTION = 'tags'

    @classmethod
    def find_by_name(cls, tag_name):
        tag_data = db[cls.COLLECTION].find_one({'name': tag_name})
        return tag_data['_id'] if tag_data else None
