import jwt
from flask import jsonify, make_response, request
from config import Config
from models.authentication_model import Authentication
from models.user_model import User, Student, Admin, Instructor
from services.mail_service import send_mail
from utils.token_utils import create_token
from models.otp_model import OTP
from controllers.student_controller import StudentController  # Import the StudentController
from models.student import Student


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
        user_classes = {'student': Student, 'instructor': Instructor, 'admin': Admin}
        user_class = user_classes.get(role)

        if role == 'admin' and data.get('token') != Config.ADMIN_TOKEN:
            return jsonify({'message': 'Invalid admin token.'}), 403

        user = user_class(name=data['name'], email=email, password=data['password'])
        user.save_to_db()

        if role == 'student':
            student_data = {
                "student_id": data.get("student_id"),  # Ensure this data is provided in the request
                "name": data['name'],
                "email": email,
                "bio": data.get("bio", ""),  # Optional bio
                "courses_enrolled": [],  # Initialize as empty, can be updated later
                "profile_image": data.get("profile_image", "")  # Optional image path
            }

            # Create student profile using the StudentController
            student_response = StudentController.create_student_profile(student_data)

            if student_response[1] != 201:  # Check if the student creation was successful
                return jsonify({"message": "User registered, but student profile creation failed."}), 500

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
