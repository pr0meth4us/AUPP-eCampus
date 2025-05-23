from flask import Blueprint
from controllers.assignment_controller import AssignmentController
from middleware.auth_middleware import login_required
from middleware.course_middleware import (
    require_course_access, require_assignment_access,
    validate_file_upload, require_enrollment_or_instructor, check_assignment_deadline
)
assignment_bp = Blueprint('assignment', __name__)

@assignment_bp.route('/', methods=['POST'])
@login_required
@require_course_access('instructor')
@validate_file_upload(
    allowed_types=['pdf', 'doc', 'docx', 'txt', 'zip'],
    max_size=50*1024*1024,
    max_count=10
)
def create_assignment(course_id):
    """Create a new assignment with optional attachments"""
    return AssignmentController.create_assignment(course_id)

@assignment_bp.route('/', methods=['GET'])
@login_required
@require_course_access('instructor')
def get_course_assignments(course_id):
    """Get all assignments for course (instructor view)"""
    return AssignmentController.get_course_assignments(course_id)

@assignment_bp.route('/student', methods=['GET'])
@login_required
@require_enrollment_or_instructor
def get_student_assignments(course_id):
    """Get assignments with student's submission status"""
    return AssignmentController.get_student_assignments(course_id)

@assignment_bp.route('/<assignment_id>', methods=['GET'])
@login_required
@require_assignment_access('view')
def get_assignment_details(course_id, assignment_id):
    """Get detailed assignment information"""
    return AssignmentController.get_assignment_details(course_id, assignment_id)

@assignment_bp.route('/<assignment_id>', methods=['PUT'])
@login_required
@require_assignment_access('grade')
@validate_file_upload(
    allowed_types=['pdf', 'doc', 'docx', 'txt', 'zip'],
    max_size=50*1024*1024,
    max_count=10
)
def update_assignment(course_id, assignment_id):
    """Update assignment details"""
    return AssignmentController.update_assignment(course_id, assignment_id)

@assignment_bp.route('/<assignment_id>', methods=['DELETE'])
@login_required
@require_assignment_access('grade')
def delete_assignment(course_id, assignment_id):
    """Delete an assignment"""
    return AssignmentController.delete_assignment(course_id, assignment_id)

@assignment_bp.route('/<assignment_id>/submit', methods=['POST'])
@login_required
@require_assignment_access('submit')
@check_assignment_deadline
def submit_assignment(course_id, assignment_id):
    """Submit assignment as student (supports file uploads)"""
    return AssignmentController.submit_assignment(course_id, assignment_id)

@assignment_bp.route('/<assignment_id>/grade/<student_id>', methods=['POST'])
@login_required
@require_assignment_access('grade')
def grade_assignment(course_id, assignment_id, student_id):
    """Grade a student's assignment submission"""
    return AssignmentController.grade_assignment(course_id, assignment_id, student_id)

@assignment_bp.route('/<assignment_id>/submissions', methods=['GET'])
@login_required
@require_assignment_access('grade')
def get_assignment_submissions(course_id, assignment_id):
    """Get all submissions for an assignment (instructor only)"""
    return AssignmentController.get_assignment_submissions(course_id, assignment_id)