from flask import g

from models.course import Submission
from services.cloudflare_service import handle_temp_file_upload


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
