from flask import Blueprint
from controllers.module_controller import ModuleController
from middleware.auth_middleware import login_required
from middleware.course_middleware import (
    require_course_access, require_module_access,
    validate_file_upload, require_enrollment_or_instructor
)

module_bp = Blueprint('module', __name__)

# Create & list modules (you already have these)
@module_bp.route('/', methods=['POST'])
@login_required
@require_course_access('instructor')
def create_module(course_id):
    return ModuleController.create_module(course_id)

@module_bp.route('/', methods=['GET'])
@login_required
@require_enrollment_or_instructor
def get_course_modules(course_id):
    return ModuleController.get_course_modules(course_id)

# Get one module (with its contents)
@module_bp.route('/<module_id>', methods=['GET'])
@login_required
@require_module_access
def get_module(course_id, module_id):
    return ModuleController.get_module(course_id, module_id)

# Edit module (partial update—PATCH) or full replace (PUT)
@module_bp.route('/<module_id>', methods=['PATCH'])
@login_required
@require_module_access
def edit_module(course_id, module_id):
    return ModuleController.edit_module(course_id, module_id)

# (If you prefer to treat PUT as “full update,” you can keep your existing PUT)
@module_bp.route('/<module_id>', methods=['PUT'])
@login_required
@require_module_access
def update_module(course_id, module_id):
    return ModuleController.update_module(course_id, module_id)

@module_bp.route('/<module_id>', methods=['DELETE'])
@login_required
@require_module_access
def delete_module(course_id, module_id):
    return ModuleController.delete_module(course_id, module_id)

# Add new content to a module
@module_bp.route('/<module_id>/content', methods=['POST'])
@login_required
@require_module_access
@validate_file_upload(
    allowed_types=['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'mp3', 'jpg', 'png'],
    max_size=100*1024*1024,
    max_count=5
)
def add_module_content(course_id, module_id):
    return ModuleController.add_module_content(course_id, module_id)

# Update a piece of content
@module_bp.route('/<module_id>/content/<content_id>', methods=['PUT', 'PATCH'])
@login_required
@require_module_access
def update_module_content(course_id, module_id, content_id):
    return ModuleController.update_module_content(course_id, module_id, content_id)

# Delete a piece of content
@module_bp.route('/<module_id>/content/<content_id>', methods=['DELETE'])
@login_required
@require_module_access
def delete_module_content(course_id, module_id, content_id):
    return ModuleController.delete_module_content(course_id, module_id, content_id)

# Reorder contents within a module
@module_bp.route('/<module_id>/content/order', methods=['PATCH'])
@login_required
@require_module_access
def reorder_contents(course_id, module_id):
    return ModuleController.reorder_module_contents(course_id, module_id)

# Publish / un-publish a module
@module_bp.route('/<module_id>/publish', methods=['PUT'])
@login_required
@require_module_access
def publish_module(course_id, module_id):
    return ModuleController.publish_module(course_id, module_id)
