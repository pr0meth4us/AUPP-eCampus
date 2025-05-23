from datetime import datetime, timezone
from bson import ObjectId
from services.mongo_service import db

class ModuleContent:
    def __init__(self, data: dict):
        self._id = data.get('_id', ObjectId())
        self.title = data.get('title')
        self.content_type = data.get('content_type')  # 'text', 'file', 'video', 'link'
        self.content = data.get('content')  # Text content or file URL
        self.file_url = data.get('file_url')
        self.file_name = data.get('file_name')
        self.file_type = data.get('file_type')
        self.order = data.get('order', 0)
        self.created_at = data.get('created_at', datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            '_id': str(self._id),
            'title': self.title,
            'content_type': self.content_type,
            'content': self.content,
            'file_url': self.file_url,
            'file_name': self.file_name,
            'file_type': self.file_type,
            'order': self.order,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    @property
    def id(self):
        return self._id

class Module:
    @classmethod
    def _coll(cls):
        return db.modules

    def __init__(self, data: dict):
        self._id = data.get('_id')
        self.course_id = data.get('course_id')
        self.title = data.get('title')
        self.description = data.get('description')
        self.order = data.get('order', 0)
        self.contents = [ModuleContent(c) for c in data.get('contents', [])]
        self.is_published = data.get('is_published', False)
        self.created_at = data.get('created_at', datetime.now(timezone.utc))
        self.updated_at = data.get('updated_at', datetime.now(timezone.utc))

    @classmethod
    def save(cls, payload: dict) -> str:
        # Import inside method to avoid circular import
        from .course_model import Course
        now = datetime.now(timezone.utc)
        doc = {
            'course_id': ObjectId(payload['course_id']),
            'title': payload['title'],
            'description': payload.get('description', ''),
            'order': payload.get('order', 0),
            'contents': [],
            'is_published': payload.get('is_published', False),
            'created_at': now,
            'updated_at': now
        }
        result = cls._coll().insert_one(doc)
        Course._coll().update_one(
            {'_id': ObjectId(payload['course_id'])},
            {'$push': {'modules': result.inserted_id}}
        )
        return str(result.inserted_id)

    @classmethod
    def add_content(cls, module_id: str, content_data: dict) -> str:
        content = ModuleContent(content_data)
        cls._coll().update_one(
            {'_id': ObjectId(module_id)},
            {
                '$push': {'contents': content.to_dict()},
                '$set': {'updated_at': datetime.now(timezone.utc)}
            }
        )
        return str(content.id)

    @classmethod
    def find_by_course(cls, course_id: str) -> list:
        docs = cls._coll().find({'course_id': ObjectId(course_id)}).sort('order', 1)
        return [cls(d).to_dict() for d in docs]

    def to_dict(self) -> dict:
        return {
            '_id': str(self._id),
            'course_id': str(self.course_id),
            'title': self.title,
            'description': self.description,
            'order': self.order,
            'contents': [c.to_dict() for c in self.contents],
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }