from flask import Blueprint

from controllers.course.module_controller import ModuleController, ModuleMaterialController
from middleware.course_middleware import require_admin_or_instructor_or_uploader

module_routes = Blueprint('module', __name__)


@module_routes.route('', methods=['GET'])
def get_modules(course_id):
    return ModuleController.get_modules(course_id)


@module_routes.route('/<module_id>', methods=['GET'])
def get_module_by_id(course_id, module_id):
    return ModuleController.get_module_by_id(course_id, module_id)


@module_routes.route('', methods=['POST'])
@require_admin_or_instructor_or_uploader
def add_course_module(course_id):
    return ModuleController.add_module(course_id)


@module_routes.route('/<module_id>/materials', methods=['POST'])
@require_admin_or_instructor_or_uploader
def add_module_material(module_id, course_id):
    return ModuleMaterialController.add_material(module_id)


@module_routes.route('/<module_id>/materials/<material_id>', methods=['PUT'])
@require_admin_or_instructor_or_uploader
def update_module_material(module_id, material_id):
    return ModuleMaterialController.update_material(module_id, material_id)


@module_routes.route('/<module_id>/materials/<material_id>', methods=['DELETE'])
@require_admin_or_instructor_or_uploader
def delete_module_material(module_id, material_id):
    return ModuleMaterialController.delete_material(module_id, material_id)


@module_routes.route('/<module_id>/materials/<material_id>', methods=['GET'])
def get_module_material(course_id, module_id, material_id):
    return ModuleMaterialController.get_material(course_id, module_id, material_id)
