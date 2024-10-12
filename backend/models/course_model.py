from bson import ObjectId
from services.mongo_service import db
from datetime import datetime, UTC


class Course:
    def __init__(self, title, description, instructor_id, video_url, uploader_id):
        self.title = title
        self.description = description
        self.instructor_id = instructor_id
        self.uploader_id = uploader_id
        self.video_url = video_url
        self.created_at = datetime.now(UTC)
        self.updated_at = datetime.now(UTC)

    def save_to_db(self):
        course_data = {
            'title': self.title,
            'description': self.description,
            'uploader_id': self.uploader_id,
            'instructor_id': self.instructor_id,
            'video_url': self.video_url,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.courses.insert_one(course_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_id(course_id):
        return db.courses.find_one({'_id': ObjectId(course_id)})

    @staticmethod
    def get_all_courses():
        courses = db.courses.find()
        return [
            {
                'id': str(course['_id']),
                'title': course['title'],
                'description': course['description'],
                'video_url': course['video_url'],
                'uploader_id': courses['uploader_id'],
                'instructor_id': courses['instructor_id'],
                'created_at': course['created_at'],
                'updated_at': course['updated_at']
            }
            for course in courses
        ]

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
