import enum
from datetime import datetime, timezone

from bson import ObjectId

from services.mongo_service import db


class FileType(enum.Enum):
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    PPT = "ppt"
    PPTX = "pptx"
    VIDEO = "video"
    AUDIO = "audio"
    IMAGE = "image"


class AssignmentType(enum.Enum):
    TEXT = "text"
    FILE_UPLOAD = "file_upload"
    QUIZ = "quiz"
    PROJECT = "project"


class SubmissionStatus(enum.Enum):
    NOT_SUBMITTED = "not_submitted"
    SUBMITTED = "submitted"
    GRADED = "graded"
    LATE = "late"


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

        # Update course modules array
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


class AssignmentSubmission:
    def __init__(self, data: dict):
        self._id = data.get('_id', ObjectId())
        self.student_id = data.get('student_id')
        self.assignment_id = data.get('assignment_id')
        self.content = data.get('content')  # Text submission
        self.file_urls = data.get('file_urls', [])  # List of uploaded file URLs
        self.file_names = data.get('file_names', [])
        self.submitted_at = data.get('submitted_at')
        self.grade = data.get('grade')
        self.feedback = data.get('feedback')
        self.status = data.get('status', SubmissionStatus.NOT_SUBMITTED.value)
        self.graded_at = data.get('graded_at')
        self.graded_by = data.get('graded_by')

    def to_dict(self) -> dict:
        return {
            '_id': str(self._id),
            'student_id': str(self.student_id),
            'assignment_id': str(self.assignment_id),
            'content': self.content,
            'file_urls': self.file_urls,
            'file_names': self.file_names,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'grade': self.grade,
            'feedback': self.feedback,
            'status': self.status,
            'graded_at': self.graded_at.isoformat() if self.graded_at else None,
            'graded_by': str(self.graded_by) if self.graded_by else None
        }


class Assignment:
    @classmethod
    def _coll(cls):
        return db.assignments

    def __init__(self, data: dict):
        self._id = data.get('_id')
        self.course_id = data.get('course_id')
        self.module_id = data.get('module_id')  # Optional - can be module-specific
        self.title = data.get('title')
        self.description = data.get('description')
        self.instructions = data.get('instructions')
        self.assignment_type = data.get('assignment_type', AssignmentType.TEXT.value)
        self.allowed_file_types = data.get('allowed_file_types', [])  # ['pdf', 'docx', 'txt']
        self.max_file_size = data.get('max_file_size', 10)  # MB
        self.max_files = data.get('max_files', 1)
        self.points = data.get('points', 100)
        self.due_date = data.get('due_date')
        self.allow_late_submission = data.get('allow_late_submission', False)
        self.late_penalty = data.get('late_penalty', 0)  # Percentage
        self.attachment_urls = data.get('attachment_urls', [])  # Instructor files
        self.attachment_names = data.get('attachment_names', [])
        self.submissions = [AssignmentSubmission(s) for s in data.get('submissions', [])]
        self.is_published = data.get('is_published', False)
        self.created_at = data.get('created_at', datetime.now(timezone.utc))
        self.updated_at = data.get('updated_at', datetime.now(timezone.utc))

    @classmethod
    def save(cls, payload: dict) -> str:
        now = datetime.now(timezone.utc)
        due_date = None
        if payload.get('due_date'):
            due_date = datetime.fromisoformat(payload['due_date'].replace('Z', '+00:00'))

        doc = {
            'course_id': ObjectId(payload['course_id']),
            'module_id': ObjectId(payload['module_id']) if payload.get('module_id') else None,
            'title': payload['title'],
            'description': payload.get('description', ''),
            'instructions': payload.get('instructions', ''),
            'assignment_type': payload.get('assignment_type', AssignmentType.TEXT.value),
            'allowed_file_types': payload.get('allowed_file_types', []),
            'max_file_size': payload.get('max_file_size', 10),
            'max_files': payload.get('max_files', 1),
            'points': payload.get('points', 100),
            'due_date': due_date,
            'allow_late_submission': payload.get('allow_late_submission', False),
            'late_penalty': payload.get('late_penalty', 0),
            'attachment_urls': payload.get('attachment_urls', []),
            'attachment_names': payload.get('attachment_names', []),
            'submissions': [],
            'is_published': payload.get('is_published', False),
            'created_at': now,
            'updated_at': now
        }
        result = cls._coll().insert_one(doc)

        # Update course assignments array
        Course._coll().update_one(
            {'_id': ObjectId(payload['course_id'])},
            {'$push': {'assignments': result.inserted_id}}
        )

        return str(result.inserted_id)

    @classmethod
    def submit_assignment(cls, assignment_id: str, student_id: str, submission_data: dict) -> str:
        now = datetime.now(timezone.utc)

        # Check if assignment exists and get due date
        assignment = cls._coll().find_one({'_id': ObjectId(assignment_id)})
        if not assignment:
            raise ValueError("Assignment not found")

        status = SubmissionStatus.SUBMITTED.value
        if assignment.get('due_date') and now > assignment['due_date']:
            status = SubmissionStatus.LATE.value

        submission = AssignmentSubmission({
            'student_id': ObjectId(student_id),
            'assignment_id': ObjectId(assignment_id),
            'content': submission_data.get('content'),
            'file_urls': submission_data.get('file_urls', []),
            'file_names': submission_data.get('file_names', []),
            'submitted_at': now,
            'status': status
        })

        # Update or insert submission
        cls._coll().update_one(
            {'_id': ObjectId(assignment_id)},
            {
                '$pull': {'submissions': {'student_id': ObjectId(student_id)}},
                '$set': {'updated_at': now}
            }
        )
        cls._coll().update_one(
            {'_id': ObjectId(assignment_id)},
            {'$push': {'submissions': submission.to_dict()}}
        )

        return str(submission._id)

    @classmethod
    def grade_submission(cls, assignment_id: str, student_id: str, grade: float, feedback: str, grader_id: str) -> None:
        now = datetime.now(timezone.utc)
        cls._coll().update_one(
            {
                '_id': ObjectId(assignment_id),
                'submissions.student_id': ObjectId(student_id)
            },
            {
                '$set': {
                    'submissions.$.grade': grade,
                    'submissions.$.feedback': feedback,
                    'submissions.$.status': SubmissionStatus.GRADED.value,
                    'submissions.$.graded_at': now,
                    'submissions.$.graded_by': ObjectId(grader_id),
                    'updated_at': now
                }
            }
        )

    @classmethod
    def find_by_course(cls, course_id: str) -> list:
        docs = cls._coll().find({'course_id': ObjectId(course_id)})
        return [cls(d).to_dict() for d in docs]

    @classmethod
    def find_by_student(cls, student_id: str, course_id: str = None) -> list:
        query = {'submissions.student_id': ObjectId(student_id)}
        if course_id:
            query['course_id'] = ObjectId(course_id)

        docs = cls._coll().find(query)
        return [cls(d).to_dict() for d in docs]

    def to_dict(self) -> dict:
        return {
            '_id': str(self._id),
            'course_id': str(self.course_id),
            'module_id': str(self.module_id) if self.module_id else None,
            'title': self.title,
            'description': self.description,
            'instructions': self.instructions,
            'assignment_type': self.assignment_type,
            'allowed_file_types': self.allowed_file_types,
            'max_file_size': self.max_file_size,
            'max_files': self.max_files,
            'points': self.points,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'allow_late_submission': self.allow_late_submission,
            'late_penalty': self.late_penalty,
            'attachment_urls': self.attachment_urls,
            'attachment_names': self.attachment_names,
            'submissions': [s.to_dict() for s in self.submissions],
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def to_student_dict(self, student_id: str = None) -> dict:
        """Return assignment with student's submission if provided"""
        data = {
            '_id': str(self._id),
            'title': self.title,
            'description': self.description,
            'instructions': self.instructions,
            'assignment_type': self.assignment_type,
            'allowed_file_types': self.allowed_file_types,
            'max_file_size': self.max_file_size,
            'max_files': self.max_files,
            'points': self.points,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'allow_late_submission': self.allow_late_submission,
            'attachment_urls': self.attachment_urls,
            'attachment_names': self.attachment_names,
        }

        if student_id:
            student_submission = next(
                (s for s in self.submissions if str(s.student_id) == student_id),
                None
            )
            data['my_submission'] = student_submission.to_dict() if student_submission else None

        return data


# Enhanced Course class with auto-filled created_at/updated_at
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
        # Auto-fill timestamps if not provided
        self.created_at = data.get('created_at', datetime.now(timezone.utc))
        self.updated_at = data.get('updated_at', datetime.now(timezone.utc))

    @classmethod
    def save(cls, payload: dict) -> str:
        now = datetime.fromisoformat(datetime.now(timezone.utc))
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
    def enroll_student(cls, course_id: str, student_id: str) -> None:
        cls._coll().update_one(
            {'_id': ObjectId(course_id)},
            {
                '$addToSet': {'enrolled_students': ObjectId(student_id)},
                '$set': {'updated_at': datetime.now(timezone.utc)}
            }
        )

    @classmethod
    def delete(cls, course_id: str) -> None:
        # Also delete related modules and assignments
        Module._coll().delete_many({'course_id': ObjectId(course_id)})
        Assignment._coll().delete_many({'course_id': ObjectId(course_id)})
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

    def to_student_dict(self, student_id: str = None) -> dict:
        """Fields a paid/enrolled student can see."""
        data = self.to_preview_dict()

        # Get modules and assignments with student-specific data
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
        """Everything, including enrolled_students and uploader info."""
        base = self.to_dict()

        # Get full modules and assignments data
        base['modules'] = Module.find_by_course(str(self._id))
        base['assignments'] = Assignment.find_by_course(str(self._id))

        return base
