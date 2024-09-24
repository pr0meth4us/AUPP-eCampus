from flask import jsonify, make_response, request, Blueprint
from config import Config
from models.authentication_model import Authentication
from models.user_model import User, Student, Admin, Instructor
from utils.token_utils import create_token
import jwt
from random import randint
from services.mail_service import send_mail
import time

otp_storage = {}


def email_otp(data):
    email = data.get('email')
    otp = randint(10000, 99999)
    send_mail(email, otp)
    otp_storage[email] = {'otp': otp, 'timestamp': time.time()}  # Store OTP with timestamp
    return otp


def verify_otp(data):
    email = data.get('email')
    received_otp = data.get('otp')

    if email in otp_storage:
        entry = otp_storage[email]
        if entry['otp'] == int(received_otp) and (time.time() - entry['timestamp'] < 300):
            del otp_storage[email]  # Remove the OTP after successful verification
            return True
    return False


def trigger_send_otp(data):
    email = data.get('email')
    role = data.get('role')

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

    email_otp(data)
    return jsonify({'message': 'OTP sent to your email.'}), 200


def verify_otp_route(data):
    email = data.get('email')
    received_otp = data.get('otp')
    role = data.get('role')

    if verify_otp({'email': email, 'otp': received_otp}):
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

        # Save the user to the database
        user = user_class(name=data['name'], email=email, password=data['password'])
        user.save_to_db()
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
            'user': {
                '_id': user_id_str,
                'email': user['email'],
                'role': role
            }
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
        role = decoded_token['role']
    except jwt.ExpiredSignatureError:
        return jsonify({"authenticated": False, "message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"authenticated": False, "message": "Invalid token"}), 401

    user = User.find_by_id(user_id)
    if not user:
        return jsonify({"authenticated": False, "message": "User not found"}), 401

    return jsonify({
        "authenticated": True,
        "user": {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email'],
            "role": user['role']
        }
    }), 200


def logout():
    response = make_response(jsonify({"message": "Successfully logged out"}), 200)
    response.set_cookie('auth_token', '', expires=0, httponly=True, secure=True, samesite='Strict')
    return response
