from models.course.module_model import Module
from models.course.course_model import Course
from flask import jsonify, request
from services.aws_service import upload_to_s3

class ModuleController:

    @staticmethod
    def add_module(course_id):
        try:
            course = Course.get_course_by_id(course_id)
            if not course:
                return jsonify({'message': 'Course not found.'}), 404

            title = request.form.get('title')
            description = request.form.get('description')
            content = request.files.get('content') or request.form.get('content')

            if not title or not description or not content:
                return jsonify({'message': 'Title, description, and content are required.'}), 400

            # Check if content is a file or plain text
            if hasattr(content, 'filename'):
                content_url = upload_to_s3(content, content.filename)
                content = content_url

            module_id = course.add_module(title=title, description=description, content=content)

            return jsonify({'message': 'Module added successfully.', 'module_id': module_id}), 201

        except Exception as e:
            return jsonify({'message': 'Failed to add module.', 'error': str(e)}), 500


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