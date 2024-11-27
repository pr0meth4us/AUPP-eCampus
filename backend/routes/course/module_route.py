from flask import Blueprint, request
from controllers.course.module_controller import ModuleController

module_routes = Blueprint('module', __name__)

@module_routes.route('/<course_id>/modules', methods=['POST'])
def create_module(course_id):
    data = request.json
    return ModuleController.create_module(course_id, data)

@module_routes.route('/<course_id>/modules', methods=['GET'])
def get_modules(course_id):
    return ModuleController.get_modules(course_id)

@module_routes.route('/<module_id>', methods=['GET'])
def get_module_by_id(module_id):
    return ModuleController.get_module_by_id(module_id)