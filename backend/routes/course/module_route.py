from flask import Blueprint

from controllers.course.module_controller import ModuleController
from middleware.course_middleware import require_admin_or_instructor_or_uploader

module_routes = Blueprint('module', __name__)


@module_routes.route('/<course_id>/modules', methods=['GET'])
def get_modules(course_id):
    return ModuleController.get_modules(course_id)


@module_routes.route('/<module_id>', methods=['GET'])
def get_module_by_id(module_id):
    return ModuleController.get_module_by_id(module_id)


@module_routes.route('/<course_id>/modules', methods=['POST'])
@require_admin_or_instructor_or_uploader
def add_course_module(course_id):
    return ModuleController.add_module(course_id)
