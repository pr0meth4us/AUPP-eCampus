from flask import Blueprint, request
from controllers.course import SubmissionController
from middleware.auth_middleware import login_required
from middleware.course_middleware import require_admin_or_instructor_or_uploader
from services.supabase_service import upload_to_s3

submission_bp = Blueprint('submissions', __name__)


@submission_bp.route('/submissions', methods=['POST'])
@login_required
def add_submission(assignment_id):
    content = request.files.get("content")
    file_url = None
    if content:
        destination_path = f"submissions/{assignment_id}/{content.filename}"
        file_url = upload_to_s3(content, destination_path)
    return SubmissionController.upload_submission_content(assignment_id, file_url)


@submission_bp.route('/<submission_id>/grade', methods=['POST'])
@require_admin_or_instructor_or_uploader
def get_grade(submission_id, **kwargs):
    return SubmissionController.grade_submission_content(submission_id)
