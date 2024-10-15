from datetime import datetime

import jwt
from flask import jsonify, make_response, request
from config import Config
from models.authentication_model import Authentication
from models.user_model import User, Admin, Instructor
from services.mail_service import send_mail
from utils.token_utils import create_token
from models.otp_model import OTP




def check_email(data):
    email = data.get('email')
    if User.find_by_email(email):
        return jsonify({'message': 'Email already exists.'}), 409

    otp = OTP.create_otp(email)
    send_mail(email, otp)
    return jsonify({'message': 'OTP sent to your email.'}), 200


def register(data):
    email = data.get('email')
    received_otp = data.get('otp')
    role = data.get('role')
    if OTP.verify_otp(email, int(received_otp)):
        user_classes = {'student': User, 'instructor': Instructor, 'admin': Admin}
        user_class = user_classes.get(role)

        # Verify admin token for admin role
        if role == 'admin' and data.get('token') != Config.ADMIN_TOKEN:
            return jsonify({'message': 'Invalid admin token.'}), 403

        # General user creation
        user_data = {
            "name": data['name'],
            "email": email,
            "password": data['password'],  # Assuming password hashing elsewhere
            "role": role,
            "profile_image": data.get("profile_image", ""),  # Optional
            "created_at": datetime.now(),
        }

        # Role-specific data
        if role == 'student':
            user_data['student_profile'] = {
                "student_id": data.get("student_id"),
                "bio": data.get("bio", ""),
                "courses_enrolled": [],  # Initialize as empty
            }
        elif role == 'instructor':
            user_data['instructor_profile'] = {
                "expertise": data.get("expertise", ""),
                "courses_taught": []  # Initialize as empty
            }

        # Save user to the database
        user = user_class(**user_data)
        user.save_to_db() # Resolved!

        return jsonify({'message': f'{role.capitalize()} registered successfully'}), 201
    else:
        return jsonify({'message': 'Invalid or expired OTP.'}), 401



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

        response = make_response(jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {'_id': user_id_str, 'email': user['email'], 'role': role}
        }), 200)
        response.set_cookie('auth_token', token, httponly=True, secure=True)

        return response

    return jsonify({'message': 'Invalid credentials'}), 401


def check_auth():
    token = request.cookies.get('auth_token')

    if not token:
        return jsonify({"authenticated": False}), 401

    try:
        decoded_token = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token['_id']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"authenticated": False, "message": "Invalid or expired token"}), 401

    user = User.find_by_id(user_id)
    if not user:
        return jsonify({"authenticated": False, "message": "User not found"}), 401

    return jsonify({"authenticated": True, "user": {"role": user['role']}}), 200


def logout():
    response = make_response(jsonify({"message": "Successfully logged out"}), 200)
    response.set_cookie('auth_token', '', expires=0, httponly=True, secure=True, samesite='Strict')
    return response
