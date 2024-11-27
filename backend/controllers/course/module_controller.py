from models.course.module_model import Module
from models.course.course_model import Course
from flask import jsonify

class ModuleController:

    @staticmethod
    def create_module(course_id, data):
        try:
            title = data.get('title')
            description = data.get('description')

            course = Course.find_by_id(course_id)
            if not course:
                return jsonify({'message': 'Course not found'}), 404

            module = Module(course_id=course_id, title=title, description=description)
            module_id = module.save_to_db()

            return jsonify({'message': 'Module created successfully', 'module_id': module_id}), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    @staticmethod
    def get_modules(course_id):
        try:
            modules = Module.get_by_course(course_id)
            return jsonify([module.to_dict() for module in modules]), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    @staticmethod
    def get_module_by_id(module_id):
        try:
            module = Module.find_by_id(module_id)
            if not module:
                return jsonify({'message': 'Module not found'}), 404
            return jsonify(module.to_dict()), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400