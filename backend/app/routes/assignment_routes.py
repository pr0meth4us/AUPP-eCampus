from flask import Blueprint
from app.controllers.assignment_controller import AssignmentController
from app.middleware.auth_middleware import login_required
from app.middleware.course_middleware import (
    require_course_access,
    require_assignment_access,
    validate_file_upload,
    require_enrollment_or_instructor,
    check_assignment_deadline
)

assignment_bp = Blueprint('assignment', __name__)

@assignment_bp.route('/', methods=['POST'])
@login_required
@require_course_access('instructor')
@validate_file_upload(
    allowed_types=['pdf', 'doc', 'docx', 'txt', 'zip'],
    max_size=50 * 1024 * 1024,
    max_count=10
)
def create_assignment(course_id):
    return AssignmentController.create_assignment(course_id)

@assignment_bp.route('/', methods=['GET'])
@login_required
@require_course_access('instructor')
def get_course_assignments(course_id):
    return AssignmentController.get_course_assignments(course_id)

@assignment_bp.route('/student', methods=['GET'])
@login_required
@require_enrollment_or_instructor
def get_student_assignments(course_id):
    return AssignmentController.get_student_assignments(course_id)

@assignment_bp.route('/<assignment_id>', methods=['GET'])
@login_required
@require_assignment_access('view')
def get_assignment_details(course_id, assignment_id):
    return AssignmentController.get_assignment_details(course_id, assignment_id)

@assignment_bp.route('/<assignment_id>', methods=['PUT'])
@login_required
@require_assignment_access('grade')
@validate_file_upload(
    allowed_types=['pdf', 'doc', 'docx', 'txt', 'zip'],
    max_size=50 * 1024 * 1024,
    max_count=10
)
def update_assignment(course_id, assignment_id):
    return AssignmentController.update_assignment(course_id, assignment_id)

@assignment_bp.route('/<assignment_id>', methods=['DELETE'])
@login_required
@require_assignment_access('grade')
def delete_assignment(course_id, assignment_id):
    return AssignmentController.delete_assignment(course_id, assignment_id)

@assignment_bp.route('/<assignment_id>/submit', methods=['POST'])
@login_required
@require_assignment_access('submit')
@check_assignment_deadline
def submit_assignment(course_id, assignment_id):
    return AssignmentController.submit_assignment(course_id, assignment_id)

@assignment_bp.route('/<assignment_id>/grade/<submission_id>', methods=['POST'])
@login_required
@require_course_access('instructor')
def grade_assignment(course_id, assignment_id, submission_id):
    return AssignmentController.grade_assignment(course_id, assignment_id, submission_id)

@assignment_bp.route('/<assignment_id>/submissions', methods=['GET'])
@login_required
@require_assignment_access('grade')
def get_assignment_submissions(course_id, assignment_id):
    return AssignmentController.get_assignment_submissions(course_id, assignment_id)

@assignment_bp.route('/<assignment_id>/publish', methods=['POST'])
@login_required
@require_assignment_access('grade')
def publish_assignment(course_id, assignment_id):
    return AssignmentController.publish_assignment(course_id, assignment_id)
