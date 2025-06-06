from flask import Blueprint
from middleware.auth_middleware import login_required
from middleware.course_middleware import (
    require_course_access,
    validate_file_upload,
    require_enrollment_or_instructor,
    require_course_published
)
from controllers.course_controller import CourseController

course_bp = Blueprint('course', __name__, url_prefix='/course')

@course_bp.route('/', methods=['POST'])
@login_required
@validate_file_upload(
    allowed_types=['jpg', 'jpeg', 'png', 'gif'],
    max_size=5 * 1024 * 1024,
    max_count=1
)
def create_course():
    """Create a new course with optional cover image."""
    return CourseController.create_course()

@course_bp.route('/<course_id>', methods=['GET'])
def get_course(course_id):
    """Get basic course information (public)."""
    return CourseController.get_course(course_id)

@course_bp.route('/<course_id>', methods=['PUT'])
@login_required
@require_course_access('instructor')
@validate_file_upload(
    allowed_types=['jpg', 'jpeg', 'png', 'gif'],
    max_size=5 * 1024 * 1024,
    max_count=1
)
def update_course(course_id):
    """Update course (only instructor/owner/admin)."""
    return CourseController.update_course(course_id)

@course_bp.route('/<course_id>', methods=['DELETE'])
@login_required
@require_course_access('owner')
def delete_course(course_id):
    """Delete course and related data (owner/admin only)."""
    return CourseController.delete_course(course_id)

@course_bp.route('/', methods=['GET'])
def get_all_courses():
    """Get all courses (public)."""
    return CourseController.get_all_courses()

@course_bp.route('/my', methods=['GET'])
@login_required
def get_my_courses():
    """Get courses associated with current user (enrolled/teaching)."""
    return CourseController.get_my_courses()

@course_bp.route('/<course_id>/preview', methods=['GET'])
@require_course_access('preview')
def preview_course(course_id):
    """Get course preview with instructor details (no auth required)."""
    return CourseController.preview_course(course_id)

@course_bp.route('/<course_id>/detail', methods=['GET'])
@login_required
@require_course_access('enrolled')
def detail_course(course_id):
    """Get detailed course content for enrolled students."""
    return CourseController.detail_course(course_id)

@course_bp.route('/<course_id>/full', methods=['GET'])
@login_required
@require_course_access('instructor')
def full_course(course_id):
    """Get full course management view (instructors only)."""
    return CourseController.full_course(course_id)

@course_bp.route('/<course_id>/enroll', methods=['POST'])
@login_required
@require_course_published
def enroll_student(course_id):
    """Enroll current user in course."""
    return CourseController.enroll_student(course_id)

@course_bp.route('/<course_id>/students', methods=['GET'])
@login_required
@require_course_access('instructor')
def get_enrolled_students(course_id):
    """Get list of enrolled students (instructor only)."""
    return CourseController.get_enrolled_students(course_id)

@course_bp.route('/<course_id>/analytics', methods=['GET'])
@login_required
@require_course_access('instructor')
def get_course_analytics(course_id):
    """Get course analytics and statistics (instructor only)."""
    return CourseController.get_course_analytics(course_id)

@course_bp.route('/<course_id>/progress', methods=['GET'])
@login_required
@require_enrollment_or_instructor
def get_course_progress(course_id):
    """Get a student’s progress in the course."""
    return CourseController.get_course_progress(course_id)

@course_bp.route('/<course_id>/publish', methods=['PUT'])
@login_required
@require_course_access('instructor')
def publish_course(course_id):
    """Publish/unpublish course."""
    return CourseController.publish_course(course_id)
