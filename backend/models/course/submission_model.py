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
        if due_date.tzinfo is None:  # Check if it's offset-naive
            due_date = due_date.replace(tzinfo=timezone.utc)  # Convert to offset-aware

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

        # Update assignment with the new submission
        db.assignments.update_one(
            {'_id': self.assignment_id},
            {'$addToSet': {'submissions': result.inserted_id}}
        )