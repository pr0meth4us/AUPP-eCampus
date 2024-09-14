from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os

client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb'))
db = client.mydb

class User:
    def __init__(self, name, email, password, role):
        self.name = name
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.role = role

    def save_to_db(self):
        if self.role == 'student':  # Ensure only students can be saved through registration
            user_data = {
                'name': self.name,
                'email': self.email,
                'password_hash': self.password_hash,
                'role': self.role
            }
            db.users.insert_one(user_data)
        else:
            raise ValueError("Only students can register through this method.")

    @staticmethod
    def find_by_email_and_role(email, role):
        return db.users.find_one({'email': email, 'role': role})

    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)