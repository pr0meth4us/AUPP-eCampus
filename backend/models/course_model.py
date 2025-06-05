import enum
from bson import ObjectId
from services.mongo_service import db
from utils.date_utils import ensure_datetime, to_iso_string, utc_now

class FileType(enum.Enum):
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    PPT = "ppt"
    PPTX = "pptx"
    VIDEO = "video"
    AUDIO = "audio"
    IMAGE = "image"

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
        self.cover_image_url = data.get('cover_image_url',
                                        "https://res.cloudinary.com/dktzt7yn1/image/upload/v1747893932/ChatGPT_Image_May_22_2025_01_04_59_PM_mwtgo9.png")
        self.major_ids = data.get('major_ids', [])
        self.tag_ids = data.get('tag_ids', [])
        self.price = data.get('price')
        self.enrolled_students = data.get('enrolled_students', [])
        self.assignments = data.get('assignments', [])
        self.modules = data.get('modules', [])
        # Ensure dates are datetime objects
        self.created_at = ensure_datetime(data.get('created_at')) or utc_now()
        self.updated_at = ensure_datetime(data.get('updated_at')) or utc_now()

    @classmethod
    def save(cls, payload: dict) -> str:
        now = utc_now()
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
        now = utc_now()
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
    def enroll_student(cls, course_id: str, student_id: str) -> None:
        cls._coll().update_one(
            {'_id': ObjectId(course_id)},
            {
                '$addToSet': {'enrolled_students': ObjectId(student_id)},
                '$set': {'updated_at': utc_now()}
            }
        )

    @classmethod
    def delete(cls, course_id: str) -> None:
        from .module_model import Module
        from .assignment_model import Assignment
        Module._coll().delete_many({'course_id': ObjectId(course_id)})
        Assignment._coll().delete_many({'course_id': ObjectId(course_id)})
        cls._coll().delete_one({'_id': ObjectId(course_id)})

    @classmethod
    def find_instance_by_id(cls, course_id: str):
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
            'created_at': to_iso_string(self.created_at),
            'updated_at': to_iso_string(self.updated_at),
        }

    def to_preview_dict(self) -> dict:
        return {
            '_id': str(self._id),
            'title': self.title,
            'description': self.description,
            'cover_image_url': self.cover_image_url,
            'price': self.price,
        }

    def to_student_dict(self, student_id: str = None) -> dict:
        data = self.to_preview_dict()
        from .module_model import Module
        from .assignment_model import Assignment
        modules = Module.find_by_course(str(self._id))
        assignments = Assignment.find_by_course(str(self._id))
        if student_id:
            assignments = [
                Assignment(Assignment._coll().find_one({'_id': ObjectId(a_id)}))
                .to_student_dict(student_id)
                for a_id in self.assignments
            ]
        data.update({
            'modules': modules,
            'assignments': assignments,
        })
        return data

    def to_instructor_dict(self) -> dict:
        base = self.to_dict()
        from .module_model import Module
        from .assignment_model import Assignment
        base['modules'] = Module.find_by_course(str(self._id))
        base['assignments'] = Assignment.find_by_course(str(self._id))
        return base