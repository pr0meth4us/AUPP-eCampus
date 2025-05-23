from bson import ObjectId
from flask import jsonify, request
from models.course_model import Course
from models.module_model import Module
from services.file_upload_service import upload_course_material
from datetime import datetime, timezone


class ModuleController:
    @staticmethod
    def create_module(course_id):
        """Create a new module for the course"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404
            data = request.get_json()
            required_fields = ['title']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400
            data['course_id'] = course_id
            module_id = Module.save(data)
            return jsonify({'message': 'Module created successfully', 'module_id': module_id}), 201
        except Exception as e:
            return jsonify({'error': f'Failed to create module: {str(e)}'}), 500

    @staticmethod
    def get_course_modules(course_id):
        """Get all modules for a course"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404
            modules = Module.find_by_course(course_id)
            return jsonify(modules), 200
        except Exception as e:
            return jsonify({'error': f'Failed to get modules: {str(e)}'}), 500

    @staticmethod
    def add_module_content(course_id, module_id):
        """Add content to a module with file upload support"""
        try:
            data = request.form.to_dict()
            required_fields = ['title', 'content_type']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400
            if data['content_type'] == 'file' and 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    upload_result = upload_course_material(file, course_id, f"modules/{module_id}")
                    if upload_result['success']:
                        data['file_url'] = upload_result['file_url']
                        data['file_name'] = upload_result['original_filename']
                        data['file_type'] = upload_result['content_type']
            content_id = Module.add_content(module_id, data)
            return jsonify({'message': 'Content added successfully', 'content_id': content_id}), 201
        except Exception as e:
            return jsonify({'error': f'Failed to add content: {str(e)}'}), 500

    @staticmethod
    def update_module(course_id, module_id):
        """Update module details"""
        try:
            from datetime import datetime, timezone
            data = request.get_json()
            data['updated_at'] = datetime.now(timezone.utc)
            Module._coll().update_one(
                {'_id': ObjectId(module_id)},
                {'$set': data}
            )
            return jsonify({'message': 'Module updated successfully'}), 200
        except Exception as e:
            return jsonify({'error': f'Failed to update module: {str(e)}'}), 500

    @staticmethod
    def delete_module(course_id, module_id):
        """Delete a module and its contents"""
        try:
            Course._coll().update_one(
                {'_id': ObjectId(course_id)},
                {'$pull': {'modules': ObjectId(module_id)}}
            )
            Module._coll().delete_one({'_id': ObjectId(module_id)})
            return jsonify({'message': 'Module deleted successfully'}), 200
        except Exception as e:
            return jsonify({'error': f'Failed to delete module: {str(e)}'}), 500

    @staticmethod
    def get_module(course_id, module_id):
        course = Course.find_instance_by_id(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        module = Module.find_by_id(module_id)
        if not module:
            return jsonify({'error': 'Module not found'}), 404
        return jsonify(module.to_dict()), 200

    @staticmethod
    def update_module_content(course_id, module_id, content_id):
        data = request.get_json()
        # validate fields...
        success = Module.update_content(module_id, content_id, data)
        return jsonify({'message': 'Content updated'}), 200 if success else (jsonify({'error':'Failed'}),500)

    @staticmethod
    def delete_module_content(course_id, module_id, content_id):
        Module._coll().update_one(
            {'_id': ObjectId(module_id)},
            {'$pull': {'contents': {'_id': content_id}}}
        )
        return jsonify({'message': 'Content deleted'}), 200

    @staticmethod
    def reorder_module_contents(course_id, module_id):
        order = request.get_json().get('order', [])
        for idx, cid in enumerate(order):
            Module._coll().update_one(
                {'_id': ObjectId(module_id), 'contents._id': cid},
                {'$set': {'contents.$.order': idx}}
            )
        Module._coll().update_one({'_id': ObjectId(module_id)},
                                  {'$set': {'updated_at': datetime.now(timezone.utc)}})
        return jsonify({'message': 'Reordered successfully'}), 200

    @staticmethod
    def publish_module(course_id, module_id):
        published = request.get_json().get('published', True)
        Module._coll().update_one(
            {'_id': ObjectId(module_id)},
            {'$set': {'is_published': bool(published), 'updated_at': datetime.now(timezone.utc)}}
        )
        status = 'published' if published else 'unpublished'
        return jsonify({'message': f'Module {status}'}), 200
