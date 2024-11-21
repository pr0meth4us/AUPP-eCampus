from flask import Blueprint, request
from controllers.course.submission_controller import SubmissionController
from middleware.auth_middleware import token_required
from middleware.course_middleware import require_admin_or_instructor_or_uploader

submission_bp = Blueprint('submissions', __name__)


@submission_bp.route('/submissions', methods=['POST'])
@token_required
def add_submission(assignment_id):
    content = request.files.get("content")
    return SubmissionController.upload_submission_content(assignment_id, content)


@submission_bp.route('/<submission_id>/grade', methods=['POST'])
@require_admin_or_instructor_or_uploader
def get_grade(submission_id, **kwargs):
    return SubmissionController.grade_submission_content(submission_id)
