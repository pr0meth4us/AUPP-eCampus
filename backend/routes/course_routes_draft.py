from flask import Blueprint
from controllers.course_controller import CourseController
from middleware.auth_middleware import login_required
from middleware.course_middleware import (
    require_course_access, require_module_access, require_assignment_access,
    validate_file_upload, require_enrollment_or_instructor, check_assignment_deadline,
    require_course_published
)

course_bp = Blueprint('course', __name__)

# Basic Course CRUD Operations
@course_bp.route('/', methods=['POST'])
@login_required
@validate_file_upload(allowed_types=['jpg', 'jpeg', 'png', 'gif'], max_size=5*1024*1024, max_count=1)
def create_course():
    """Create a new course with optional cover image"""
    return CourseController.create_course()

@course_bp.route('/<course_id>', methods=['GET'])
def get_course(course_id):
    """Get basic course information (public)"""
    return CourseController.get_course(course_id)

@course_bp.route('/<course_id>', methods=['PUT'])
@login_required
@require_course_access('instructor')
@validate_file_upload(allowed_types=['jpg', 'jpeg', 'png', 'gif'], max_size=5*1024*1024, max_count=1)
def update_course(course_id):
    """Update course (only course instructor/owner/admin)"""
    return CourseController.update_course(course_id)

@course_bp.route('/<course_id>', methods=['DELETE'])
@login_required
@require_course_access('owner')
def delete_course(course_id):
    """Delete course (only course owner/admin)"""
    return CourseController.delete_course(course_id)

@course_bp.route('/', methods=['GET'])
def get_all_courses():
    """Get all courses (public)"""
    return CourseController.get_all_courses()

@course_bp.route('/my', methods=['GET'])
@login_required
def get_my_courses():
    """Get user's courses (enrolled/teaching)"""
    return CourseController.get_my_courses()

# Course Access Levels
@course_bp.route('/<course_id>/preview', methods=['GET'])
@require_course_access('preview')
def preview_course(course_id):
    """Get course preview - no auth required"""
    return CourseController.preview_course(course_id)

@course_bp.route('/<course_id>/detail', methods=['GET'])
@login_required
@require_course_access('enrolled')
def detail_course(course_id):
    """Get detailed course content - requires enrollment and payment"""
    return CourseController.detail_course(course_id)

@course_bp.route('/<course_id>/full', methods=['GET'])
@login_required
@require_course_access('instructor')
def full_course(course_id):
    """Get full course management view - instructors only"""
    return CourseController.full_course(course_id)

# Enrollment
@course_bp.route('/<course_id>/enroll', methods=['POST'])
@login_required
@require_course_published
def enroll_student(course_id):
    """Enroll current user in course"""
    return CourseController.enroll_student(course_id)

# Module Management
@course_bp.route('/<course_id>/modules', methods=['POST'])
@login_required
@require_course_access('instructor')
def create_module(course_id):
    """Create a new module in the course"""
    return CourseController.create_module(course_id)

@course_bp.route('/<course_id>/modules', methods=['GET'])
@login_required
@require_enrollment_or_instructor
def get_course_modules(course_id):
    """Get all modules for a course"""
    return CourseController.get_course_modules(course_id)

@course_bp.route('/<course_id>/modules/<module_id>/content', methods=['POST'])
@login_required
@require_module_access
@validate_file_upload(
    allowed_types=['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'mp3', 'jpg', 'png'],
    max_size=100*1024*1024,  # 100MB for course materials
    max_count=5
)
def add_module_content(course_id, module_id):
    """Add content to a module (supports file uploads)"""
    return CourseController.add_module_content(course_id, module_id)

# Assignment Management
@course_bp.route('/<course_id>/assignments', methods=['POST'])
@login_required
@require_course_access('instructor')
@validate_file_upload(
    allowed_types=['pdf', 'doc', 'docx', 'txt', 'zip'],
    max_size=50*1024*1024,  # 50MB for assignment attachments
    max_count=10
)
def create_assignment(course_id):
    """Create a new assignment with optional attachments"""
    return CourseController.create_assignment(course_id)

@course_bp.route('/<course_id>/assignments', methods=['GET'])
@login_required
@require_course_access('instructor')
def get_course_assignments(course_id):
    """Get all assignments for course (instructor view)"""
    return CourseController.get_course_assignments(course_id)

@course_bp.route('/<course_id>/assignments/student', methods=['GET'])
@login_required
@require_enrollment_or_instructor
def get_student_assignments(course_id):
    """Get assignments with student's submission status"""
    return CourseController.get_student_assignments(course_id)

# Assignment Submissions
@course_bp.route('/<course_id>/assignments/<assignment_id>/submit', methods=['POST'])
@login_required
@require_assignment_access('submit')
@check_assignment_deadline
def submit_assignment(course_id, assignment_id):
    """Submit assignment as student (supports file uploads)"""
    return CourseController.submit_assignment(course_id, assignment_id)

@course_bp.route('/<course_id>/assignments/<assignment_id>/grade/<student_id>', methods=['POST'])
@login_required
@require_assignment_access('grade')
def grade_assignment(course_id, assignment_id, student_id):
    """Grade a student's assignment submission"""
    return CourseController.grade_assignment(course_id, assignment_id, student_id)

# Additional Enhanced Routes

@course_bp.route('/<course_id>/assignments/<assignment_id>/submissions', methods=['GET'])
@login_required
@require_assignment_access('grade')
def get_assignment_submissions(course_id, assignment_id):
    """Get all submissions for an assignment (instructor only)"""
    return CourseController.get_assignment_submissions(course_id, assignment_id)

@course_bp.route('/<course_id>/assignments/<assignment_id>', methods=['GET'])
@login_required
@require_assignment_access('view')
def get_assignment_details(course_id, assignment_id):
    """Get detailed assignment information"""
    return CourseController.get_assignment_details(course_id, assignment_id)

@course_bp.route('/<course_id>/assignments/<assignment_id>', methods=['PUT'])
@login_required
@require_assignment_access('grade')
@validate_file_upload(
    allowed_types=['pdf', 'doc', 'docx', 'txt', 'zip'],
    max_size=50*1024*1024,
    max_count=10
)
def update_assignment(course_id, assignment_id):
    """Update assignment details"""
    return CourseController.update_assignment(course_id, assignment_id)

@course_bp.route('/<course_id>/assignments/<assignment_id>', methods=['DELETE'])
@login_required
@require_assignment_access('grade')
def delete_assignment(course_id, assignment_id):
    """Delete an assignment"""
    return CourseController.delete_assignment(course_id, assignment_id)

@course_bp.route('/<course_id>/modules/<module_id>', methods=['PUT'])
@login_required
@require_module_access
def update_module(course_id, module_id):
    """Update module details"""
    return CourseController.update_module(course_id, module_id)

@course_bp.route('/<course_id>/modules/<module_id>', methods=['DELETE'])
@login_required
@require_module_access
def delete_module(course_id, module_id):
    """Delete a module and its contents"""
    return CourseController.delete_module(course_id, module_id)

@course_bp.route('/<course_id>/modules/<module_id>/content/<content_id>', methods=['DELETE'])
@login_required
@require_module_access
def delete_module_content(course_id, module_id, content_id):
    """Delete specific module content"""
    return CourseController.delete_module_content(course_id, module_id, content_id)

@course_bp.route('/<course_id>/analytics', methods=['GET'])
@login_required
@require_course_access('instructor')
def get_course_analytics(course_id):
    """Get course analytics and statistics"""
    return CourseController.get_course_analytics(course_id)

@course_bp.route('/<course_id>/progress', methods=['GET'])
@login_required
@require_enrollment_or_instructor
def get_course_progress(course_id):
    """Get student's progress in the course"""
    return CourseController.get_course_progress(course_id)

@course_bp.route('/<course_id>/duplicate', methods=['POST'])
@login_required
@require_course_access('instructor')
def duplicate_course(course_id):
    """Create a copy of existing course"""
    return CourseController.duplicate_course(course_id)

@course_bp.route('/<course_id>/publish', methods=['POST'])
@login_required
@require_course_access('instructor')
def publish_course(course_id):
    """Publish/unpublish course"""
    return CourseController.publish_course(course_id)

Bulk operations
@course_bp.route('/<course_id>/assignments/<assignment_id>/submissions/download', methods=['GET'])
@login_required
@require_assignment_access('grade')
def download_all_submissions(course_id, assignment_id):
    """Download all submissions as a ZIP file"""
    return CourseController.download_all_submissions(course_id, assignment_id)

@course_bp.route('/<course_id>/assignments/<assignment_id>/grades/export', methods=['GET'])
@login_required
@require_assignment_access('grade')
def export_grades(course_id, assignment_id):
    """Export grades as CSV"""
    return CourseController.export_grades(course_id, assignment_id)

@course_bp.route('/<course_id>/assignments/<assignment_id>/grades/import', methods=['POST'])
@login_required
@require_assignment_access('grade')
@validate_file_upload(allowed_types=['csv'], max_size=1*1024*1024, max_count=1)
def import_grades(course_id, assignment_id):
    """Import grades from CSV"""
    return CourseController.import_grades(course_id, assignment_id)