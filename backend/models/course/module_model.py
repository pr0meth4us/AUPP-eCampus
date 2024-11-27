from datetime import datetime
from services.mongo_service import db
from bson import ObjectId


class Module:
    def __init__(self, course_id, title, description, content, _id=None, created_at=None, updated_at=None):
        self._id = _id
        self.course_id = ObjectId(course_id)
        self.title = title
        self.description = description
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()
        self.content = content

    def to_dict(self):
        return {
            '_id': str(self._id) if self._id else None,
            'course_id': ObjectId(self.course_id),
            'title': self.title,
            'description': self.description,
            'content': self.content,  # Added content here
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    def save_to_db(self):
        module_data = self.to_dict()
        module_data.pop('_id')
        result = db.modules.insert_one(module_data)
        self._id = result.inserted_id
        return str(self._id)

    @staticmethod
    def get_by_course(course_id):
        lis = list(db.modules.find({'course_id': ObjectId(course_id)}))
        print(lis,course_id, "sfd")
        return lis

    @staticmethod
    def find_by_id(module_id):
        return db.modules.find_one({'_id': ObjectId(module_id)})
