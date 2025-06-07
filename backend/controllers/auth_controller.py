from flask import jsonify, request, make_response
from models.user_model import User
from services.mail_service import send_mail
from models.otp_model import OTP
from utils.token_utils import create_token, decode_token
from config import Config

class AuthController:
    @staticmethod
    def send_otp():
        data = request.get_json()
        email = data.get('email')
        if not email:
            return jsonify({'message': 'Email is required'}), 400
        if User.find_by_email(email):
            return jsonify({'message': 'Email already registered'}), 409
        otp = OTP.create_otp(email)
        send_mail(email, otp)
        return jsonify({'message': 'OTP sent to your email'}), 200

    @staticmethod
    def register():
        data = request.get_json()
        required = ['email', 'otp', 'role', 'name', 'password']
        if not all(data.get(k) for k in required):
            return jsonify({'message': 'Missing required fields'}), 400

        email, received_otp, role = data['email'], data['otp'], data['role']
        name, password = data['name'], data['password']
        token = data.get('token') if role == 'admin' else None

        if not OTP.verify_otp(email, received_otp):
            return jsonify({'message': 'Invalid OTP'}), 400
        if role not in ['student', 'instructor', 'admin']:
            return jsonify({'message': 'Invalid role'}), 400
        if role == 'admin' and token != Config.ADMIN_TOKEN:
            return jsonify({'message': 'Invalid admin token'}), 403

        user = User(name=name, email=email, password=password, role=role)
        user.save()
        return jsonify({'message': f'{role.capitalize()} registered successfully'}), 201

    @staticmethod
    def login():
        data = request.get_json()
        required = ['email', 'password', 'role']
        if not all(data.get(k) for k in required):
            return jsonify({'message': 'Missing required fields'}), 400

        email, password, role = data['email'], data['password'], data['role']
        if role not in ['student', 'instructor', 'admin']:
            return jsonify({'message': 'Invalid role'}), 400

        user = User.find_by_email(email)
        if user and User.verify_password(user.password_hash, password) and user.role == role:
            token = create_token(user.to_dict())
            response = make_response(jsonify({
                'message': 'Login successful',
                'user': {'_id': str(user._id), 'email': user.email, 'role': user.role, 'name': user.name}
            }), 200)
            response.set_cookie('auth_token', token, httponly=True, secure=True, samesite='Strict')
            return response
        return jsonify({'message': 'Invalid credentials'}), 401

    @staticmethod
    def check_auth():
        token = request.cookies.get('auth_token')
        if not token:
            return jsonify({"authenticated": False, "message": "No token provided"}), 401
        user_data = decode_token(token)
        if user_data:
            return jsonify({"authenticated": True, "user": user_data}), 200
        return jsonify({"authenticated": False, "message": "Invalid or expired token"}), 401

    @staticmethod
    def logout():
        response = make_response(jsonify({"message": "Logged out successfully"}), 200)
        response.set_cookie('auth_token', '', expires=0, httponly=True, secure=True, samesite='Strict')
        return response