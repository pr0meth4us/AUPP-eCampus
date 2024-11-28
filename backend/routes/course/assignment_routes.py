from flask import Blueprint, request
from controllers.course import AssignmentController
from middleware.course_middleware import require_admin_or_instructor_or_uploader
from services.cloudflare_service import handle_temp_file_upload

assignment_bp = Blueprint('assignments', __name__)


@assignment_bp.route('', methods=['POST'])
@require_admin_or_instructor_or_uploader
def add_assignment(course_id):
    data = request.form.to_dict()
    file = request.files.get('file')
    if file:
        file_url = handle_temp_file_upload(file, "assignment")
        data['file'] = file_url
    title = request.form.get('title')
    description = request.form.get('description')
    due_date = request.form.get('due_date')
    max_grade = request.form.get('max_grade')
    allow_late_submission = request.form.get('allow_late_submission', 'false').lower() == 'true'
    return AssignmentController.add_assignment(course_id, title, description, due_date, max_grade, allow_late_submission )


@assignment_bp.route('', methods=['GET'])
def get_assignments(course_id):
    return AssignmentController.get_assignments(course_id)


@assignment_bp.route('/<assignment_id>', methods=['GET'])
def get_assignment(assignment_id):
    return AssignmentController.get_assignment_by_id(assignment_id)


@assignment_bp.route('/<assignment_id>', methods=['DELETE'])
def delete_assignment(assignment_id):
    return AssignmentController.delete_assignment(assignment_id)
