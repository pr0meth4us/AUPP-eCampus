from flask import jsonify

from config import Config
from models.authentication_model import Authentication
from models.user_model import User, Student, Admin
from utils.token_utils import create_token


def register_user(data):
    role = data.get('role')

    if role == 'student':
        new_student = Student(name=data['name'], email=data['email'], password=data['password'])
        new_student.save_to_db()
        return jsonify({'message': 'Student registered successfully'}), 201

    elif role == 'instructor':
        """TO DO"""""

    elif role == 'admin':
        if data.get('token') != Config.ADMIN_TOKEN:
            return jsonify({'message': 'Invalid admin token.'}), 403

        new_admin = Admin(name=data['name'], email=data['email'], password=data['password'])
        admin_id = new_admin.save_to_db()

        return jsonify({'message': 'Admin registered successfully', 'id': admin_id}), 201

    else:
        return jsonify({'message': 'Invalid role specified.'}), 400


def login_user(data):
    role = data.get('role')

    if not role or role not in ['student', 'instructor', 'admin']:
        return jsonify(
            {'message': 'You must specify whether you are logging in as student, instructor, or admin.'}), 400

    user = User.find_by_email_and_role(data['email'], role)
    if user and User.verify_password(user['password_hash'], data['password']):
        # Convert ObjectId to string
        user_id_str = str(user['_id'])

        token = create_token({'_id': user_id_str, 'email': user['email'], 'role': role})
        auth = Authentication(user_id=user['_id'], token=token)
        auth.save_to_db()

        return jsonify({'token': token, 'role': role}), 200

    return jsonify({'message': 'Invalid credentials'}), 401
