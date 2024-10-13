from bson import ObjectId
from services.mongo_service import db
from datetime import datetime, UTC
from models.user_model import User

class Course:
    def __init__(self, title, description, instructor_id, video_url, uploader_id, thumbnail_url):
        self.title = title
        self.description = description
        self.instructor_id = ObjectId(instructor_id)
        self.uploader_id = ObjectId(uploader_id)
        self.video_url = video_url
        self.thumbnail_url = thumbnail_url
        self.created_at = datetime.now(UTC)
        self.updated_at = datetime.now(UTC)

    def save_to_db(self):
        course_data = {
            'title': self.title,
            'description': self.description,
            'instructor_id': self.instructor_id,
            'uploader_id': self.uploader_id,
            'video_url': self.video_url,
            'thumbnail_url': self.thumbnail_url,
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
        course_list = []
        for course in courses:
            instructor = User.find_by_id(course['instructor_id'])
            uploader = User.find_by_id(course['uploader_id'])
            course_list.append({
                'id': str(course['_id']),
                'title': course.get('title', 'N/A'),
                'description': course.get('description', 'N/A'),
                'video_url': course.get('video_url', None),
                'instructor': instructor.get('name'),
                'uploader': uploader.get('name'),
                'created_at': course.get('created_at', None),
                'updated_at': course.get('updated_at', None),
                'thumbnail_url': course.get('thumbnail_url', None)
            })
        return course_list

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
