from flask import Blueprint, request
from controllers.auth_controller import AuthController
from middleware.recaptcha_middleware import require_recaptcha

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    return AuthController.check_email(data)


@require_recaptcha
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    role = data.get('role')
    email = data.get('email')
    password = data.get('password')
    return AuthController.login_user(email, role, password)


@auth_bp.route('/check', methods=['GET'])
def auth_check():
    token = request.cookies.get('auth_token')
    return AuthController.check_auth(token)


@require_recaptcha
@auth_bp.route('/register', methods=['POST'])
def verify_otp_and_register():
    data = request.get_json()
    email = data.get('email')
    received_otp = data.get('otp')
    role = data.get('role')
    name = data.get('name')
    password = data.get('password')
    token = ""
    if role == "admin":
        token = data.get('token')
    return AuthController.register(name, email, role, password, received_otp, token)


@auth_bp.route('/signout', methods=['POST'])
def sign_out():
    return AuthController.logout()
