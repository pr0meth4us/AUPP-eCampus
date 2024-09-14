from werkzeug.security import generate_password_hash
from models.user_model import User
from models.authentication_model import Authentication
from utils.token_utils import create_token
from flask import jsonify


def register_user(data):
    if data['role'] != 'student':
        return jsonify({'message': 'Only students can register.'}), 403

    hashed_password = generate_password_hash(data['password'])
    new_user = User(name=data['name'], email=data['email'], password=hashed_password, role=data['role'])
    new_user.save_to_db()

    return jsonify({'message': 'Student registered successfully'}), 201


def login_user(data):
    role = data.get('role')

    if not role or role not in ['student', 'instructor']:
        return jsonify({'message': 'You must specify whether you are logging in as student or instructor.'}), 400

    user = User.find_by_email_and_role(data['email'], role)
    if user and User.verify_password(user['password_hash'], data['password']):
        token = create_token(user)
        auth = Authentication(user_id=user['_id'], token=token)
        auth.save_to_db()

        return jsonify({'token': token, 'role': role}), 200

    return jsonify({'message': 'Invalid credentials'}), 401
