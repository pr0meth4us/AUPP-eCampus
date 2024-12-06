from flask import g, request
from bson import ObjectId
from models.course import Submission
from services.cloudflare_service import handle_temp_file_upload
from services.mongo_service import db


class SubmissionController:
    @staticmethod
    def upload_submission_content(assigment_id, content):
        student_id = g.current_user['_id']
        file_url = None
        if content:
            file_url = handle_temp_file_upload(content, "submission")

        submission = Submission(
            assignment_id=assigment_id,
            student_id=student_id,
            content=file_url
        )
        submission.save_to_db()

        return "Submission successfully uploaded"

    @staticmethod
    def grade_submission_content(submission_id):
        data = request.json
        grade = data['grade']
        feedback = data.get('feedback', None)
        print("grde", grade, feedback, submission_id)

        result = db.submissions.update_one(
            {'_id': ObjectId(submission_id)},
            {'$set': {'grade': grade, 'feedback': feedback}}
        )
        print("result", result)

        return "graded"
