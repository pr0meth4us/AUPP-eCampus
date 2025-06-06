from datetime import datetime, timezone
from bson import ObjectId
import enum
from services.mongo_service import db
from .course_model import Course
from utils.date_utils import ensure_datetime, to_iso_string, utc_now

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

class AssignmentSubmission:
    def __init__(self, data: dict):
        # _id
        self._id = data.get('_id', ObjectId())
        # student_id and assignment_id (store as ObjectId or string depending on context)
        self.student_id = data.get('student_id')
        self.assignment_id = data.get('assignment_id')
        # content, files
        self.content = data.get('content')
        self.file_urls = data.get('file_urls', [])
        self.file_names = data.get('file_names', [])
        # Convert submitted_at and graded_at to UTC‐aware datetime
        self.submitted_at = ensure_datetime(data.get('submitted_at'))
        self.grade = data.get('grade')
        self.feedback = data.get('feedback')
        self.status = data.get('status', SubmissionStatus.NOT_SUBMITTED.value)
        self.graded_at = ensure_datetime(data.get('graded_at'))
        self.graded_by = data.get('graded_by')

    def to_dict(self) -> dict:
        return {
            '_id': str(self._id),
            'student_id': str(self.student_id),
            'assignment_id': str(self.assignment_id),
            'content': self.content,
            'file_urls': self.file_urls,
            'file_names': self.file_names,
            'submitted_at': to_iso_string(self.submitted_at),
            'grade': self.grade,
            'feedback': self.feedback,
            'status': self.status,
            'graded_at': to_iso_string(self.graded_at),
            'graded_by': str(self.graded_by) if self.graded_by else None
        }

class Assignment:
    @classmethod
    def _coll(cls):
        return db.assignments

    def __init__(self, data: dict):
        self._id = data.get('_id')
        self.course_id = data.get('course_id')
        self.module_id = data.get('module_id')
        self.title = data.get('title')
        self.description = data.get('description')
        self.instructions = data.get('instructions')
        self.assignment_type = data.get('assignment_type', AssignmentType.TEXT.value)
        self.allowed_file_types = data.get('allowed_file_types', [])
        self.max_file_size = data.get('max_file_size', 10)
        self.max_files = data.get('max_files', 1)
        self.points = data.get('points', 100)
        # Ensure due_date is UTC-aware
        self.due_date = ensure_datetime(data.get('due_date'))
        self.allow_late_submission = data.get('allow_late_submission', False)
        self.late_penalty = data.get('late_penalty', 0)
        self.attachment_urls = data.get('attachment_urls', [])
        self.attachment_names = data.get('attachment_names', [])
        # Build AssignmentSubmission objects
        self.submissions = [AssignmentSubmission(s) for s in data.get('submissions', [])]
        self.is_published = data.get('is_published', False)
        # created_at / updated_at as UTC-aware
        self.created_at = ensure_datetime(data.get('created_at')) or utc_now()
        self.updated_at = ensure_datetime(data.get('updated_at')) or utc_now()

    @classmethod
    def save(cls, payload: dict) -> str:
        now = utc_now()
        due_date = None
        if payload.get('due_date'):
            due_date = ensure_datetime(payload['due_date'])

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

        # Also push this assignment ID into the Course document
        Course._coll().update_one(
            {'_id': ObjectId(payload['course_id'])},
            {'$push': {'assignments': result.inserted_id}}
        )

        return str(result.inserted_id)

    @classmethod
    def submit_assignment(cls, assignment_id: str, student_id: str, submission_data: dict) -> str:
        """
        submission_data: {
            'content': <string>,
            'file_urls': [<url>, ...],
            'file_names': [<filename>, ...]
        }
        """
        now = utc_now()

        # Fetch the raw assignment document
        assignment_doc = cls._coll().find_one({'_id': ObjectId(assignment_id)})
        if not assignment_doc:
            raise ValueError("Assignment not found")

        # Determine submission status (on-time vs late)
        status = SubmissionStatus.SUBMITTED.value
        due_date = ensure_datetime(assignment_doc.get('due_date'))
        if due_date and now > due_date:
            status = SubmissionStatus.LATE.value

        # Build a new AssignmentSubmission
        submission = AssignmentSubmission({
            'student_id': ObjectId(student_id),
            'assignment_id': ObjectId(assignment_id),
            'content': submission_data.get('content'),
            'file_urls': submission_data.get('file_urls', []),
            'file_names': submission_data.get('file_names', []),
            'submitted_at': now,
            'status': status
        })

        # Remove any existing submission by this student, then push new one
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
    def grade_submission(cls, assignment_id: str, submission_id: str, grade: float, feedback: str, grader_id: str) -> None:
        now = utc_now()

        cls._coll().update_one(
            {
                '_id': ObjectId(assignment_id),
                'submissions._id': submission_id
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
        query = {'submissions.student_id': ObjectId(student_id) if isinstance(student_id, str) else student_id}
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

    def to_student_dict(self, student_id: str) -> dict:
        """
        Return assignment info plus ALL of this student's submissions,
        sorted by 'submitted_at', and also a 'final_grade' field.
        """
        data = {
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
            'attachment_urls': self.attachment_urls,
            'attachment_names': self.attachment_names,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

        # 1) Filter for this student's submissions
        submissions_for_student = [
            s for s in self.submissions if str(s.student_id) == student_id
        ]

        # 2) Sort them by submitted_at (oldest→newest)
        submissions_for_student.sort(
            key=lambda s: s.submitted_at or datetime.min.replace(tzinfo=timezone.utc)
        )

        # 3) Serialize each one
        data['my_submissions'] = [s.to_dict() for s in submissions_for_student]

        # 4) Compute final_grade: choose the highest graded submission (or None if none graded)
        graded_submissions = [s for s in submissions_for_student if s.grade is not None]
        if graded_submissions:
            # e.g. pick max grade; you can change logic to “latest” instead if desired
            best_grade = max(s.grade for s in graded_submissions)
            data['final_grade'] = best_grade
        else:
            data['final_grade'] = None

        return data