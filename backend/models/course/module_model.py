from datetime import datetime
from services.mongo_service import db
from bson import ObjectId
import logging

class Material:
    def __init__(self, title, description, content_url, _id=None):
        self._id = _id or str(ObjectId())
        self.title = title
        self.description = description
        self.content_url = content_url

    def to_dict(self):
        return {
            '_id': self._id,
            'title': self.title,
            'description': self.description,
            'content_url': self.content_url
        }

class Module:
    def __init__(self, course_id, title, description, materials=None, _id=None, created_at=None, updated_at=None):
        self._id = _id
        self.course_id = ObjectId(course_id)
        self.title = title
        self.description = description
        self.materials = materials or []
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()

    def add_material(self, title, description, content_url):
        material = Material(title, description, content_url)
        self.materials.append(material.to_dict())

    def to_dict(self):
        return {
            '_id': str(self._id) if self._id else None,
            'course_id': self.course_id,
            'title': self.title,
            'description': self.description,
            'materials': self.materials,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    def save_to_db(self):
        module_data = self.to_dict()
        module_data.pop('_id', None)

        try:
            result = db.modules.insert_one(module_data)
            self._id = result.inserted_id
            return str(self._id)
        except Exception as e:
            logging.error(f"Error saving module to database: {e}")
            raise

    def update_in_db(self):
        try:
            update_data = {
                'title': self.title,
                'description': self.description,
                'materials': self.materials,
                'updated_at': datetime.now()
            }

            result = db.modules.update_one(
                {'_id': ObjectId(self._id)},
                {'$set': update_data}
            )

            if result.modified_count == 0:
                raise ValueError("No module found to update")

            return str(self._id)
        except Exception as e:
            logging.error(f"Error updating module in database: {e}")
            raise

    @staticmethod
    def get_by_course(course_id):
        print(course_id, "cors")
        return list(db.modules.find({'course_id': ObjectId(course_id)}))
    @staticmethod
    def find_by_id(module_id):
        try:
            return db.modules.find_one({'_id': ObjectId(module_id)})
        except Exception as e:
            logging.error(f"Error finding module by ID: {e}")
            raise

    @staticmethod
    def delete_by_id(module_id):
        try:
            result = db.modules.delete_one({'_id': ObjectId(module_id)})
            if result.deleted_count == 0:
                raise ValueError("No module found to delete")
            return True
        except Exception as e:
            logging.error(f"Error deleting module: {e}")
            raise

    def add_material(self, title, description, content_url):
        material = {
            '_id': str(ObjectId()),
            'title': title,
            'description': description,
            'content_url': content_url
        }
        self.materials.append(material)
        return material['_id']

    def update_material(self, material_id, title=None, description=None, content_url=None):
        for material in self.materials:
            if material['_id'] == material_id:
                if title is not None:
                    material['title'] = title
                if description is not None:
                    material['description'] = description
                if content_url is not None:
                    material['content_url'] = content_url
                return material_id
        raise ValueError(f"Material with ID {material_id} not found")

    def delete_material(self, material_id):
        for i, material in enumerate(self.materials):
            if material['_id'] == material_id:
                del self.materials[i]
                return True
        raise ValueError(f"Material with ID {material_id} not found")

    def update_in_db(self):
        try:
            update_data = {
                'title': self.title,
                'description': self.description,
                'materials': self.materials,
                'updated_at': datetime.now()
            }

            result = db.modules.update_one(
                {'_id': ObjectId(self._id)},
                {'$set': update_data}
            )

            if result.modified_count == 0:
                raise ValueError("No module found to update")

            return str(self._id)
        except Exception as e:
            logging.error(f"Error updating module in database: {e}")
            raise

    @staticmethod
    def find_material_in_module(module_id, material_id):
        try:
            module = db.modules.find_one(
                {'_id': ObjectId(module_id), 'materials._id': material_id},
                {'materials.$': 1}
            )
            return module['materials'][0] if module else None
        except Exception as e:
            logging.error(f"Error finding material in module: {e}")
            raise