# controllers/module_controller.py

from bson import ObjectId
from flask import jsonify, request
from app.models.course_model import Course
from app.models.module_model import Module
from app.services.file_upload_service import upload_course_material
from datetime import datetime, timezone


class ModuleController:
    @staticmethod
    def create_module(course_id):
        """Create a new module for the course"""
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            data = request.get_json() or {}
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
                    # ← specify provider="supabase" (or "cloudflare" etc.) here
                    upload_result = upload_course_material(
                        file,
                        course_id,
                        f"modules/{module_id}",
                        provider="aws"
                    )
                    if upload_result.get('success'):
                        data['file_url']      = upload_result.get('file_url')
                        data['file_name']     = upload_result.get('original_filename')
                        data['file_type']     = upload_result.get('content_type')
                    else:
                        error_msg = upload_result.get('error', 'unknown upload error')
                        return jsonify({'error': error_msg}), 500

            content_id = Module.add_content(module_id, data)
            return jsonify({'message': 'Content added successfully', 'content_id': content_id}), 201

        except Exception as e:
            return jsonify({'error': f'Failed to add content: {str(e)}'}), 500

    @staticmethod
    def update_module(course_id, module_id):
        """Update module details"""
        try:
            data = request.get_json() or {}
            data['updated_at'] = datetime.now(timezone.utc)
            result = Module._coll().update_one({'_id': ObjectId(module_id)}, {'$set': data})
            if result.matched_count == 0:
                return jsonify({'error': 'Module not found'}), 404
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
        data = request.get_json() or {}
        success = Module.update_content(module_id, content_id, data)
        if success:
            return jsonify({'message': 'Content updated'}), 200
        else:
            return jsonify({'error': 'Failed'}), 500

    @staticmethod
    def delete_module_content(course_id, module_id, content_id):
        try:
            result = Module._coll().update_one(
                {'_id': ObjectId(module_id)},
                {'$pull': {'contents': {'_id': content_id}}}
            )
            if result.modified_count == 0:
                return jsonify({'error': 'Content not found'}), 404
            return jsonify({'message': 'Content deleted'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to delete content: {str(e)}'}), 500

    @staticmethod
    def reorder_module_contents(course_id, module_id):
        order = request.get_json().get('order', [])
        try:
            for idx, cid in enumerate(order):
                Module._coll().update_one(
                    {'_id': ObjectId(module_id), 'contents._id': cid},
                    {'$set': {'contents.$.order': idx}}
                )
            Module._coll().update_one(
                {'_id': ObjectId(module_id)},
                {'$set': {'updated_at': datetime.now(timezone.utc)}}
            )
            return jsonify({'message': 'Reordered successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to reorder contents: {str(e)}'}), 500

    @staticmethod
    def publish_module(course_id, module_id):
        try:
            published = request.get_json().get('published', True)
            result = Module._coll().update_one(
                {'_id': ObjectId(module_id)},
                {'$set': {'is_published': bool(published), 'updated_at': datetime.now(timezone.utc)}}
            )
            if result.matched_count == 0:
                return jsonify({'error': 'Module not found'}), 404

            status = 'published' if published else 'unpublished'
            return jsonify({'message': f'Module {status}'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to publish module: {str(e)}'}), 500

    @staticmethod
    def reorder_modules(course_id):
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            payload = request.get_json() or {}
            order_list = payload.get('order', [])
            if not isinstance(order_list, list) or not order_list:
                return jsonify({'error': 'Invalid or empty order array'}), 400

            for idx, mod_id in enumerate(order_list):
                result = Module._coll().update_one(
                    {'_id': ObjectId(mod_id), 'course_id': ObjectId(course_id)},
                    {'$set': {'order': idx, 'updated_at': datetime.now(timezone.utc)}}
                )
                if result.modified_count == 0:
                    return jsonify({'error': f'Module {mod_id} not found in course'}), 404

            return jsonify({'message': 'Modules reordered successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to reorder modules: {str(e)}'}), 500

    @staticmethod
    def edit_module(course_id, module_id):
        """
        Partially update module fields (e.g., title, description, order, is_published).
        Only the keys present in JSON will be $set.
        """
        try:
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            data = request.get_json() or {}
            if not data:
                return jsonify({'error': 'No data provided'}), 400

            if 'course_id' in data:
                data.pop('course_id')

            data['updated_at'] = datetime.now(timezone.utc)
            update_fields = {
                k: v for k, v in data.items()
                if k in ['title', 'description', 'order', 'is_published', 'updated_at']
            }

            if not update_fields:
                return jsonify({'error': 'No valid fields to update'}), 400

            result = Module._coll().update_one(
                {'_id': ObjectId(module_id)},
                {'$set': update_fields}
            )
            if result.matched_count == 0:
                return jsonify({'error': 'Module not found'}), 404

            return jsonify({'message': 'Module updated successfully'}), 200

        except Exception as e:
            return jsonify({'error': f'Failed to edit module: {str(e)}'}), 500
