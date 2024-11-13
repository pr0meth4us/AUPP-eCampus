from datetime import datetime, timezone
from bson import ObjectId
from services.mongo_service import db

UTC = timezone.utc


class Course:
    def __init__(self, title, description, instructor_id, video_url, uploader_id, thumbnail_url, major_ids, tag_ids,
                 amount, enrolled_students):
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
        self.amount = amount
        self.enrolled_students = enrolled_students if isinstance(enrolled_students, list) else []

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
            'updated_at': self.updated_at,
            'amount': self.amount,
            'enrolled_students': self.enrolled_students
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

    def add_student(self, student_id):
        if student_id not in self.enrolled_students:
            self.enrolled_students.append(ObjectId(student_id))
            self.save_to_db()

    def remove_student(self, student_id):
        # Remove student from the enrolled_students list
        if ObjectId(student_id) in self.enrolled_students:
            self.enrolled_students.remove(ObjectId(student_id))
            self.save_to_db()

    def get_major_names(self):
        majors = [db.majors.find_one({'_id': mid}) for mid in self.major_ids]
        return [major['name'] if major else 'Unknown' for major in majors]

    def get_tag_names(self):
        tags = [db.tags.find_one({'_id': tid}) for tid in self.tag_ids]
        return [tag['name'] if tag else 'Unknown' for tag in tags]


class Major:
    def __init__(self, name):
        self.name = name
        self.created_at = datetime.now(UTC)

    def save_to_db(self):
        major_data = {
            'name': self.name,
            'created_at': self.created_at
        }
        result = db.majors.insert_one(major_data)
        return str(result.inserted_id)

    @staticmethod
    def get_all():
        return db.majors.find()

    @staticmethod
    def find_by_id(major_id):
        return db.majors.find_one({'_id': ObjectId(major_id)})


class Tag:
    def __init__(self, name):
        self.name = name
        self.created_at = datetime.now(UTC)

    def save_to_db(self):
        tag_data = {
            'name': self.name,
            'created_at': self.created_at
        }
        result = db.tags.insert_one(tag_data)
        return str(result.inserted_id)

    @staticmethod
    def get_all():
        return db.tags.find()

    @staticmethod
    def find_by_id(tag_id):
        return db.tags.find_one({'_id': ObjectId(tag_id)})

    @staticmethod
    def find_by_name(name):
        return db.tags.find_one({'name': name})
