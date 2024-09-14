import os
import random

from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

from config import Config

client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb'))
db = client.mydb


class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.role = None

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


class Student(User):
    def __init__(self, name, email, password):
        super().__init__(name, email, password)
        self.role = 'student'


class Instructor(User):
    def __init__(self, name, email, password):
        super().__init__(name, email, password)
        self.role = 'instructor'

    @classmethod
    def create_by_admin(cls, admin_user, name, email, password):
        if admin_user.role != 'admin':
            raise PermissionError("Only admins can create instructors.")
        return cls(name, email, password)


class Admin(User):
    def __init__(self, name, email, password):
        super().__init__(name, email, password)
        self.role = 'admin'
        self.token = Config.ADMIN_TOKEN

    @staticmethod
    def generate_id():
        """Generate a unique 4-digit ID."""
        return f"{random.randint(1000, 9999)}"

    def get_last_name(self):
        """Extract last name from full name."""
        return self.name.split()[-1]

    def save_to_db(self):
        admin_data = {
            'name': self.name,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'token': self.token,
            'id': f"{self.generate_id()}_{self.get_last_name().upper()}"
        }
        db.users.insert_one(admin_data)
