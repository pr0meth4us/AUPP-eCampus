from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from services.mongo_service import db
from config import Config


class User:
    def __init__(self, name, email, password, bio=None, role=None):
        self.name = name
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.bio = bio
        self.role = role
        self.profile_image = None

    def save_to_db(self):
        if self.is_email_taken(self.email):
            raise ValueError(f"Email '{self.email}' is already in use.")

        user_data = {
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'bio': self.bio,
            'profile_image': self.profile_image
        }
        db.users.insert_one(user_data)

    @staticmethod
    def is_email_taken(email):
        return db.users.find_one({'email': email}) is not None

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
            if User.is_email_taken(new_email):
                raise ValueError(f"Email '{new_email}' is already in use.")
            update_data['email'] = new_email
        if new_password:
            update_data['password_hash'] = generate_password_hash(new_password)

        result = db.users.update_one({'_id': ObjectId(user_id)}, {'$set': update_data})
        if result.modified_count == 0:
            raise ValueError("User not found or no changes made.")


class Student(User):
    def __init__(self, name, email, password, bio=None):
        super().__init__(name, email, password, bio, role='student')
        self.courses_enrolled = []
        self.profile_image = None

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

    def enroll_in_course(self, course_id):
        if course_id not in self.courses_enrolled:
            self.courses_enrolled.append(course_id)
            db.users.update_one({'email': self.email}, {'$set': {'courses_enrolled': self.courses_enrolled}})


class Instructor(User):
    def __init__(self, name, email, password, bio=None):
        super().__init__(name, email, password, bio, role='instructor')
        self.expertise = []
        self.profile_image = None

    def save_to_db(self):
        instructor_data = {
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'bio': self.bio,
            'expertise': self.expertise,
            'profile_image': self.profile_image
        }
        db.users.insert_one(instructor_data)

    def add_expertise(self, expertise_area):
        if expertise_area not in self.expertise:
            self.expertise.append(expertise_area)
            db.users.update_one({'email': self.email}, {'$set': {'expertise': self.expertise}})


class Admin(User):
    def __init__(self, name, email, password):
        super().__init__(name, email, password, role='admin')
        self.token = Config.ADMIN_TOKEN

    def save_to_db(self):
        if self.is_email_taken(self.email):
            raise ValueError(f"Email '{self.email}' is already in use.")

        admin_data = {
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role
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
