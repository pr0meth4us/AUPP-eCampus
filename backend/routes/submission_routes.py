from flask import Blueprint, request
from controllers.course.submission_controller import SubmissionController
from middleware.auth_middleware import token_required

submission_bp = Blueprint('submissions', __name__)


@submission_bp.route('/submissions', methods=['POST'])
@token_required
def add_submission(assignment_id):
    content = request.files.get("content")
    return SubmissionController.upload_submission_content(assignment_id, content)
