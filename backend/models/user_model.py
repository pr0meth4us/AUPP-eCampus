from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from services.mongo_service import db
from config import Config

class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.role = None  # Placeholder, will be set by subclasses (student/instructor/admin)

    def save_to_db(self):
        user_data = {
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role
        }
        db.users.insert_one(user_data)

    @staticmethod
    def find_by_email_and_role(email, role):
        return db.users.find_one({'email': email, 'role': role})

    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)

    @staticmethod
    def find_by_email(email):
        return db.users.find_one({'email': email})

    @staticmethod
    def find_by_id(user_id):
        return db.users.find_one({'_id': ObjectId(user_id)})

    @staticmethod
    def update_user(user_id, new_name=None, new_email=None, new_password=None):
        update_data = {}
        if new_name:
            update_data['name'] = new_name
        if new_email:
            update_data['email'] = new_email
        if new_password:
            update_data['password_hash'] = generate_password_hash(new_password)

        result = db.users.update_one({'_id': ObjectId(user_id)}, {'$set': update_data})
        if result.modified_count == 0:
            raise ValueError("User not found or no changes made.")


class Student(User):
    def __init__(self, name, email, password, bio=None, courses_enrolled=None, profile_image=None):
        super().__init__(name, email, password)
        self.role = 'student'
        self.bio = bio or ""
        self.courses_enrolled = courses_enrolled or []
        self.profile_image = profile_image or ""

    def save_to_db(self):
        student_data = {
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'bio': self.bio,
            'courses_enrolled': self.courses_enrolled,
            'profile_image': self.profile_image
        }
        db.users.insert_one(student_data)


class Instructor(User):
    def __init__(self, name, email, password, expertise=None, profile_image=None):
        super().__init__(name, email, password)
        self.role = 'instructor'
        self.expertise = expertise or ""
        self.profile_image = profile_image or ""

    def save_to_db(self):
        instructor_data = {
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'expertise': self.expertise,
            'profile_image': self.profile_image
        }
        db.users.insert_one(instructor_data)


class Admin(User):
    def __init__(self, name, email, password):
        super().__init__(name, email, password)
        self.role = 'admin'
        self.token = Config.ADMIN_TOKEN

    def save_to_db(self):
        admin_data = {
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'token': self.token
        }
        db.users.insert_one(admin_data)

    @staticmethod
    def delete_user(user_id):
        result = db.users.delete_one({'_id': ObjectId(user_id)})
        if result.deleted_count == 0:
            raise ValueError("User not found.")

    @staticmethod
    def get_all_users():
        users = db.users.find()
        return [
            {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
            for user in users
        ]