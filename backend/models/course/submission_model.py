from bson import ObjectId
from services.mongo_service import db
from datetime import datetime, timezone


class Submission:
    def __init__(self, assignment_id, student_id, content, submitted_at=None, grade=None, feedback=None):
        self.assignment_id = ObjectId(assignment_id)
        self.student_id = ObjectId(student_id)
        self.content = content
        self.submitted_at = submitted_at if submitted_at else datetime.now(timezone.utc)
        self.grade = grade
        self.feedback = feedback
        self.is_late = False

    def save_to_db(self):
        assignment = db.assignments.find_one({'_id': self.assignment_id})

        if not assignment:
            raise ValueError("Assignment not found.")

        if assignment.get('is_locked', False):
            raise ValueError("Submissions are locked for this assignment.")

        due_date = assignment['due_date']
        if due_date.tzinfo is None:
            due_date = due_date.replace(tzinfo=timezone.utc)

        if self.submitted_at > due_date:
            if not assignment.get('allow_late_submissions', False):
                raise ValueError("Late submissions are not allowed.")
            self.is_late = True

        submission_data = {
            'assignment_id': self.assignment_id,
            'student_id': self.student_id,
            'content': self.content,
            'submitted_at': self.submitted_at,
            'grade': self.grade,
            'feedback': self.feedback,
            'is_late': self.is_late
        }
        result = db.submissions.insert_one(submission_data)

        db.assignments.update_one(
            {'_id': self.assignment_id},
            {'$addToSet': {'submissions': result.inserted_id}}
        )

    @staticmethod
    def get_by_course(assignment_id, student_id):
        assignment_id = ObjectId(assignment_id) if isinstance(assignment_id, str) else assignment_id
        student_id = ObjectId(student_id) if isinstance(student_id, str) else student_id
        print(assignment_id, student_id, "kdmv nis")
        submissions = db.submissions.find({
            'assignment_id': ObjectId(assignment_id),
            'student_id': ObjectId(student_id)
        })
        submission_list = [submission for submission in submissions]
        return submission_list

    @staticmethod
    def get_all_submissions_for_teacher(assignment_id):
        submissions = db.submissions.find({'assignment_id':  ObjectId(assignment_id)})
        submission_list = [submission for submission in submissions]
        return submission_list

