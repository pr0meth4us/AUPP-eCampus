from datetime import datetime, timezone
from services.mongo_service import db
from bson import ObjectId


class Assignment:
    def __init__(self, course_id, title, description, due_date, max_grade, file, allow_late_submission, is_locked= False):
        self._id = None
        self.course_id = course_id
        self.title = title
        self.description = description
        self.due_date = datetime.strptime(due_date, "%Y-%m-%dT%H:%M:%SZ")
        self.max_grade = max_grade
        self.file = file if file is not None else None
        self.created_at = datetime.now(timezone.utc)
        self.submissions = []
        self.allow_late_submission = allow_late_submission
        self.is_locked = is_locked

    def to_dict(self):
        return {
            "course_id": self.course_id,
            "title": self.title,
            "description": self.description,
            "due_date": self.due_date,
            "max_grade": self.max_grade,
            "file": self.file,
            "submissions": self.submissions,
            "created_at": self.created_at
        }

    def save_to_db(self):
        assignment_data = self.to_dict()
        result = db.assignments.insert_one(assignment_data)
        self._id = result.inserted_id
        return result.inserted_id

    @staticmethod
    def get_by_id(assignment_id):
        return db.assigments.find_one({"_id": assignment_id})

    @staticmethod
    def delete_from_db(assignment_id):
        return db.assigments.delete_one({"_id": assignment_id})

    def lock_submissions(self):
        self.is_locked = True
        db.assignments.update_one({'_id': self._id}, {'$set': {'is_locked': True}})

    def open_submissions(self):
        self.is_locked = False
        db.assignments.update_one({'_id': self._id}, {'$set': {'is_locked': False}})

    @staticmethod
    def get_course_id(assignment_id):
        return db.assignments.find_one({"_id": ObjectId(assignment_id)})['course_id']

    @staticmethod
    def get_by_course(course_id):
        return list(db.assignments.find({'course_id': ObjectId(course_id)}))

    @staticmethod
    def add_submission(self, submission_id):
        result = db.assignments.update_one(
            {'_id': self._id},
            {'$addToSet': {'submissions': ObjectId(submission_id)}}
        )
        return result
