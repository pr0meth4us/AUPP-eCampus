from flask import Blueprint

from controllers.auth_controller import AuthController
from middleware.recaptcha_middleware import require_recaptcha

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    return AuthController.send_otp()


@auth_bp.route('/register', methods=['POST'])
@require_recaptcha
def register():
    return AuthController.register()


@auth_bp.route('/login', methods=['POST'])
@require_recaptcha
def login():
    return AuthController.login()


@auth_bp.route('/check', methods=['GET'])
def check_auth():
    return AuthController.check_auth()


@auth_bp.route('/logout', methods=['POST'])
def logout():
    return AuthController.logout()
