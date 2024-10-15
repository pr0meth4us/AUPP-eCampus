from flask import Blueprint, request
from controllers.auth_controller import login_user, check_auth, register, check_email, logout
from middleware.auth_middleware import require_recaptcha

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    return check_email(data)


@require_recaptcha
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return login_user(data)


@auth_bp.route('/check', methods=['GET'])
def auth_check():
    return check_auth()


@require_recaptcha
@auth_bp.route('/register', methods=['POST'])
def verify_otp_and_register():
    data = request.get_json()
    return register(data)


@auth_bp.route('/sign out', methods=['POST'])
def sign_out():
    return logout()
