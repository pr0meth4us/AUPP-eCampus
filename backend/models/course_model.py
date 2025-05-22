from bson import ObjectId
from datetime import datetime, timezone
from services.mongo_service import db


class Course:
    @classmethod
    def _coll(cls):
        return db.courses

    def __init__(self, data: dict):
        self._id = data.get('_id')
        self.title = data.get('title')
        self.description = data.get('description')
        self.instructor_id = data.get('instructor_id')
        self.uploader_id = data.get('uploader_id')
        self.cover_image_url = data.get('cover_image_url', "https://res.cloudinary.com/dktzt7yn1/image/upload"
                                                           "/v1747893932/ChatGPT_Image_May_22_2025_01_04_59_PM_mwtgo9"
                                                           ".png")
        self.major_ids = data.get('major_ids', [])
        self.tag_ids = data.get('tag_ids', [])
        self.price = data.get('price')
        self.enrolled_students = data.get('enrolled_students', [])
        self.assignments = data.get('assignments', [])
        self.modules = data.get('modules', [])
        self.created_at = data.get('created_at')
        self.updated_at = data.get('updated_at')

    @classmethod
    def save(cls, payload: dict) -> str:
        now = datetime.now(timezone.utc)
        doc = {
            'title': payload['title'],
            'description': payload['description'],
            'instructor_id': ObjectId(payload['instructor_id']),
            'uploader_id': ObjectId(payload['uploader_id']),
            'cover_image_url': payload.get('cover_image_url'),
            'major_ids': [ObjectId(mid) for mid in payload.get('major_ids', [])],
            'tag_ids': [ObjectId(tid) for tid in payload.get('tag_ids', [])],
            'price': payload.get('price'),
            'enrolled_students': [],
            'assignments': [],
            'modules': [],
            'created_at': now,
            'updated_at': now
        }
        result = cls._coll().insert_one(doc)
        return str(result.inserted_id)

    @classmethod
    def update(cls, course_id: str, payload: dict) -> None:
        now = datetime.now(timezone.utc)
        set_fields = {}
        for key in ['title', 'description', 'price']:
            if key in payload:
                set_fields[key] = payload[key]
        if 'instructor_id' in payload:
            set_fields['instructor_id'] = ObjectId(payload['instructor_id'])
        if 'uploader_id' in payload:
            set_fields['uploader_id'] = ObjectId(payload['uploader_id'])
        if 'tag_ids' in payload:
            set_fields['tag_ids'] = [ObjectId(t) for t in payload['tag_ids']]
        if 'major_ids' in payload:
            set_fields['major_ids'] = [ObjectId(m) for m in payload['major_ids']]
        set_fields['updated_at'] = now
        cls._coll().update_one({'_id': ObjectId(course_id)}, {'$set': set_fields})

    @classmethod
    def delete(cls, course_id: str) -> None:
        cls._coll().delete_one({'_id': ObjectId(course_id)})

    @classmethod
    def find_instance_by_id(cls, course_id: str):
        """Return a Course object (not a dict)."""
        doc = cls._coll().find_one({'_id': ObjectId(course_id)})
        return cls(doc) if doc else None

    @classmethod
    def find_by_id(cls, course_id: str) -> dict:
        doc = cls._coll().find_one({'_id': ObjectId(course_id)})
        return cls(doc).to_dict() if doc else None

    @classmethod
    def find_all(cls) -> list:
        docs = cls._coll().find()
        return [cls(d).to_dict() for d in docs]

    @classmethod
    def find_by_user(cls, user_id: str, role: str = None) -> list:
        user_oid = ObjectId(user_id)
        if role == 'instructor':
            query = {'instructor_id': user_oid}
        elif role == 'student':
            query = {'enrolled_students': user_oid}
        else:
            query = {'$or': [
                {'instructor_id': user_oid},
                {'enrolled_students': user_oid}
            ]}
        docs = cls._coll().find(query)
        return [cls(d).to_dict() for d in docs]

    def to_dict(self) -> dict:
        return {
            '_id': str(self._id),
            'title': self.title,
            'description': self.description,
            'instructor_id': str(self.instructor_id),
            'uploader_id': str(self.uploader_id),
            'cover_image_url': self.cover_image_url,
            'major_ids': [str(mid) for mid in self.major_ids],
            'tag_ids': [str(tid) for tid in self.tag_ids],
            'price': self.price,
            'enrolled_students': [str(s) for s in self.enrolled_students],
            'assignments': [str(a) for a in self.assignments],
            'modules': [str(m) for m in self.modules],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def to_preview_dict(self) -> dict:
        """Fields visible to anyone."""
        return {
            '_id': str(self._id),
            'title': self.title,
            'description': self.description,
            'cover_image_url': self.cover_image_url,
            'price': self.price,
        }

    def to_student_dict(self) -> dict:
        """Fields a paid/enrolled student can see."""
        data = self.to_preview_dict()
        data.update({
            'modules': [str(m) for m in self.modules],
            'assignments': [str(a) for a in self.assignments],
        })
        return data

    def to_instructor_dict(self) -> dict:
        """Everything, including enrolled_students and uploader info."""
        base = self.to_student_dict()
        base.update({
            'instructor_id': str(self.instructor_id),
            'uploader_id': str(self.uploader_id),
            'major_ids': [str(m) for m in self.major_ids],
            'tag_ids': [str(t) for t in self.tag_ids],
            'enrolled_students': [str(s) for s in self.enrolled_students],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        })
        return base
