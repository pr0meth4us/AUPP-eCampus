from flask import jsonify, make_response
from config import Config
from models.authentication_model import Authentication
from models.user_model import User, Student, Admin, Instructor
from utils.token_utils import create_token, extract_role_from_token


def register_user(role, data):
    email = data.get('email')

    if User.find_by_email(email):
        return jsonify({'message': 'Email already exists.'}), 409

    user_classes = {
        'student': Student,
        'instructor': Instructor,
        'admin': Admin
    }

    user_class = user_classes.get(role)
    if role == 'admin' and data.get('token') != Config.ADMIN_TOKEN:
        return jsonify({'message': 'Invalid admin token.'}), 403
    elif user_class is None:
        return jsonify({'message': 'Invalid role specified.'}), 400

    user = user_class(name=data['name'], email=email, password=data['password'])
    user.save_to_db()
    return jsonify({'message': f'{role.capitalize()} registered successfully'}), 201


def login_user(data):
    role = data.get('role')

    if not role or role not in ['student', 'instructor', 'admin']:
        return jsonify(
            {'message': 'You must specify whether you are logging in as student, instructor, or admin.'}), 400

    user = User.find_by_email_and_role(data['email'], role)
    if user and User.verify_password(user['password_hash'], data['password']):
        user_id_str = str(user['_id'])

        token = create_token({'_id': user_id_str, 'email': user['email'], 'role': role})
        auth = Authentication(user_id=user['_id'], token=token)
        auth.save_to_db()

        response = make_response(jsonify({'message': 'Login successful', 'role': role}), 200)
        response.set_cookie('auth_token', token, httponly=True, secure=True)

        return response

    return jsonify({'message': 'Invalid credentials'}), 401
