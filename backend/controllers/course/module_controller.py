from bson import ObjectId
from utils.helpers import serialize_document

class ModuleController:
    @staticmethod
    def add_module(course_id):
        try:
            title = request.form.get('title')
            description = request.form.get('description')
            module = Module(course_id=course_id, title=title, description=description)
            materials = request.files.getlist('materials')
            material_titles = request.form.getlist('material_titles')
            material_descriptions = request.form.getlist('material_descriptions')
            for material, title, description in zip(materials, material_titles, material_descriptions):
                material_url = upload_to_s3(material, material.filename)
                module.add_material(
                    title=title,
                    description=description,
                    content_url=material_url
                )

            module_id = module.save_to_db()
            print(module_id)
            Course.update_course(course_id=course_id, **{"$push": {"modules": ObjectId(module_id)}})

            return jsonify({
                'message': 'Module with materials added successfully.',
                'module_id': module_id
            }), 201

        except Exception as e:
            logging.error(f"Module creation error: {e}")
            return jsonify({
                'message': 'Failed to add module.',
                'error': str(e)
            }), 500

    @staticmethod
    def update_module(module_id):
        try:
            # Find existing module
            existing_module = Module.find_by_id(module_id)
            if not existing_module:
                return jsonify({'message': 'Module not found.'}), 404

            # Extract updated module details
            title = request.form.get('title', existing_module['title'])
            description = request.form.get('description', existing_module['description'])

            # Create module instance
            module = Module(
                course_id=existing_module['course_id'],
                title=title,
                description=description,
                materials=existing_module.get('materials', []),
                _id=module_id
            )

            # Handle material updates
            materials = request.files.getlist('materials')
            material_titles = request.form.getlist('material_titles')
            material_descriptions = request.form.getlist('material_descriptions')

            # If new materials are provided, replace existing
            if materials and material_titles and material_descriptions:
                module.materials = []  # Clear existing materials
                for material, title, description in zip(materials, material_titles, material_descriptions):
                    try:
                        # Upload material to cloud storage
                        material_url = upload_to_s3(material, material.filename)

                        # Add material to module
                        module.add_material(
                            title=title,
                            description=description,
                            content_url=material_url
                        )
                    except Exception as upload_error:
                        logging.error(f"Material upload error: {upload_error}")
                        return jsonify({'message': f'Failed to upload material: {material.filename}'}), 500

            # Update module in database
            updated_module_id = module.update_in_db()

            return jsonify({
                'message': 'Module updated successfully.',
                'module_id': updated_module_id
            }), 200

        except Exception as e:
            logging.error(f"Module update error: {e}")
            return jsonify({
                'message': 'Failed to update module.',
                'error': str(e)
            }), 500



    @staticmethod
    def get_modules(course_id):
        try:
            modules = Module.get_by_course(course_id)
            return jsonify([module.to_dict() for module in modules]), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    @staticmethod
    def get_module_by_id(course_id, module_id):
        try:
            module = Module.find_by_id(course_id, module_id)
            if not module:
                return jsonify({'message': 'Module not found'}), 404

            serialized_module = serialize_document(module)
            return jsonify(serialized_module), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400


from models.course.module_model import Module
from models.course.course_model import Course
from flask import jsonify, request, g
from services.aws_service import upload_to_s3
import logging

class ModuleMaterialController:
    @staticmethod
    def add_material(module_id):
        try:
            # Find existing module
            existing_module = Module.find_by_id(module_id)
            if not existing_module:
                return jsonify({'message': 'Module not found.'}), 404

            # Extract material details
            title = request.form.get('title')
            description = request.form.get('description')
            content_file = request.files.get('content')

            # Validate required fields
            if not all([title, description, content_file]):
                return jsonify({'message': 'Title, description, and content are required.'}), 400

            try:
                # Upload content to cloud storage
                content_url = upload_to_s3(content_file, content_file.filename)
            except Exception as upload_error:
                logging.error(f"Material upload error: {upload_error}")
                return jsonify({'message': 'Failed to upload material.'}), 500

            # Create module instance
            module = Module(
                course_id=existing_module['course_id'],
                title=existing_module['title'],
                description=existing_module['description'],
                materials=existing_module.get('materials', []),
                _id=module_id
            )

            # Add material to module
            material_id = module.add_material(
                title=title,
                description=description,
                content_url=content_url
            )

            # Update module in database
            module.update_in_db()

            return jsonify({
                'message': 'Material added successfully.',
                'material_id': material_id
            }), 201

        except Exception as e:
            logging.error(f"Material addition error: {e}")
            return jsonify({
                'message': 'Failed to add material.',
                'error': str(e)
            }), 500

    @staticmethod
    def update_material(module_id, material_id):
        try:
            # Find existing module
            existing_module = Module.find_by_id(module_id)
            if not existing_module:
                return jsonify({'message': 'Module not found.'}), 404

            # Create module instance
            module = Module(
                course_id=existing_module['course_id'],
                title=existing_module['title'],
                description=existing_module['description'],
                materials=existing_module.get('materials', []),
                _id=module_id
            )

            # Extract update details
            title = request.form.get('title')
            description = request.form.get('description')
            content_file = request.files.get('content')

            # Prepare update data
            update_data = {}
            if title:
                update_data['title'] = title
            if description:
                update_data['description'] = description

            # Handle content file upload if provided
            if content_file:
                try:
                    content_url = upload_to_s3(content_file, content_file.filename)
                    update_data['content_url'] = content_url
                except Exception as upload_error:
                    logging.error(f"Material upload error: {upload_error}")
                    return jsonify({'message': 'Failed to upload material.'}), 500

            # Update material in module
            module.update_material(material_id, **update_data)

            # Update module in database
            module.update_in_db()

            return jsonify({
                'message': 'Material updated successfully.',
                'material_id': material_id
            }), 200

        except ValueError as ve:
            return jsonify({'message': str(ve)}), 404
        except Exception as e:
            logging.error(f"Material update error: {e}")
            return jsonify({
                'message': 'Failed to update material.',
                'error': str(e)
            }), 500

    @staticmethod
    def delete_material(module_id, material_id):
        try:
            # Find existing module
            existing_module = Module.find_by_id(module_id)
            if not existing_module:
                return jsonify({'message': 'Module not found.'}), 404

            # Create module instance
            module = Module(
                course_id=existing_module['course_id'],
                title=existing_module['title'],
                description=existing_module['description'],
                materials=existing_module.get('materials', []),
                _id=module_id
            )

            # Delete material from module
            module.delete_material(material_id)

            # Update module in database
            module.update_in_db()

            return jsonify({
                'message': 'Material deleted successfully.'
            }), 200

        except ValueError as ve:
            return jsonify({'message': str(ve)}), 404
        except Exception as e:
            logging.error(f"Material deletion error: {e}")
            return jsonify({
                'message': 'Failed to delete material.',
                'error': str(e)
            }), 500

    @staticmethod
    def get_material(course_id, module_id, material_id):
        try:
            # Find material in module
            material = Module.find_material_in_module(course_id, module_id, material_id)

            if not material:
                return jsonify({'message': 'Material not found'}), 404

            return jsonify(material), 200

        except Exception as e:
            logging.error(f"Error retrieving material: {e}")
            return jsonify({
                'message': 'Failed to retrieve material.',
                'error': str(e)
            }), 400