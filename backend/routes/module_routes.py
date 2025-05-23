from flask import Blueprint
from controllers.module_controller import ModuleController
from middleware.auth_middleware import login_required
from middleware.course_middleware import (
    require_course_access, require_module_access,
    validate_file_upload, require_enrollment_or_instructor
)
module_bp = Blueprint('module', __name__)

@module_bp.route('/', methods=['POST'])
@login_required
@require_course_access('instructor')
def create_module(course_id):
    """Create a new module in the course"""
    return ModuleController.create_module(course_id)

@module_bp.route('/', methods=['GET'])
@login_required
@require_enrollment_or_instructor
def get_course_modules(course_id):
    """Get all modules for a course"""
    return ModuleController.get_course_modules(course_id)

@module_bp.route('/<module_id>/content', methods=['POST'])
@login_required
@require_module_access
@validate_file_upload(
    allowed_types=['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'mp3', 'jpg', 'png'],
    max_size=100*1024*1024,
    max_count=5
)
def add_module_content(course_id, module_id):
    """Add content to a module (supports file uploads)"""
    return ModuleController.add_module_content(course_id, module_id)

@module_bp.route('/<module_id>', methods=['PUT'])
@login_required
@require_module_access
def update_module(course_id, module_id):
    """Update module details"""
    return ModuleController.update_module(course_id, module_id)

@module_bp.route('/<module_id>', methods=['DELETE'])
@login_required
@require_module_access
def delete_module(course_id, module_id):
    """Delete a module and its contents"""
    return ModuleController.delete_module(course_id, module_id)

@module_bp.route('/<module_id>', methods=['GET'])
@login_required
@require_module_access
def get_module(course_id, module_id):
    """Get detailed info for one module (including its contents)"""
    return ModuleController.get_module(course_id, module_id)

@module_bp.route('/<module_id>/content/<content_id>', methods=['PUT'])
@login_required
@require_module_access
def update_content(course_id, module_id, content_id):
    """Edit title, description, reorder or replace file/link"""
    return ModuleController.update_module_content(course_id, module_id, content_id)

@module_bp.route('/<module_id>/content/<content_id>', methods=['DELETE'])
@login_required
@require_module_access
def delete_content(course_id, module_id, content_id):
    """Remove one content item from a module"""
    return ModuleController.delete_module_content(course_id, module_id, content_id)

@module_bp.route('/<module_id>/content/order', methods=['PATCH'])
@login_required
@require_module_access
def reorder_contents(course_id, module_id):
    """
    Accepts JSON: { "order": ["contentId1", "contentId2", ...] }
    and updates each content's .order field.
    """
    return ModuleController.reorder_module_contents(course_id, module_id)
@module_bp.route('/<module_id>/publish', methods=['PUT'])
@login_required
@require_module_access
def publish_module(course_id, module_id):
    """Toggle module.is_published (or accept {published: true/false})"""
    return ModuleController.publish_module(course_id, module_id)
