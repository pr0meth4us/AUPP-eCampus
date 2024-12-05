from flask import jsonify, make_response, request
import jwt
from config import Config
from models.user_model import User, Student, Admin, Instructor
from services.mail_service import send_mail
from utils.token_utils import create_token
from models.otp_model import OTP


class AuthController:
    @staticmethod
    def check_email(data):
        email = data.get('email')
        try:
            User.is_email_taken(email)
        except ValueError as e:
            return jsonify({'message': str(e)}), 400

        otp = OTP.create_otp(email)
        send_mail(email, otp)
        return jsonify({'message': 'OTP sent to your email.'}), 200

    @staticmethod
    def register(name, email, role, password, received_otp, token=None):
        if User.find_by_email(email):
            return jsonify({'message': 'Email already exists.'}), 409
        if OTP.verify_otp(email, int(received_otp)):
            user_classes = {'student': Student, 'instructor': Instructor, 'admin': Admin}
            user_class = user_classes.get(role)

            if role == 'admin' and token != Config.ADMIN_TOKEN:
                return jsonify({'message': 'Invalid admin token.'}), 403

            user = user_class(name, email, password)
            user.save_to_db()
            return jsonify({'message': f'{role.capitalize()} registered successfully'}), 201

    @staticmethod
    def login_user(email, role, password):
        if not role or role not in ['student', 'instructor', 'admin']:
            return jsonify(
                {'message': 'You must specify whether you are logging in as student, instructor, or admin.'}), 400

        user = User.find_by_email(email)
        print(user)
        if user and User.verify_password(user['password_hash'], password):
            token = create_token(user)

            response = make_response(jsonify({
                'message': 'Login successful',
                'user': {'_id': str(user['_id']), 'email': user['email'], 'role': role}
            }), 200)
            response.set_cookie('auth_token', token, httponly=True, secure=True)

            return response

        return jsonify({'message': 'Invalid credentials'}), 401

    @staticmethod
    def check_auth(token):

        if not token:
            return jsonify({"authenticated": False}), 401

        try:
            decoded_token = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return jsonify({"authenticated": False, "message": "Invalid or expired token"}), 401

        return jsonify({
            "authenticated": True,
            "user": decoded_token
        }), 200

    @staticmethod
    def logout():
        response = make_response(jsonify({"message": "Successfully logged out"}), 200)
        response.set_cookie('auth_token', '', expires=0, httponly=True, secure=True, samesite='Strict')
        return response
