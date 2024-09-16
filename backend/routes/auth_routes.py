from flask import Blueprint, request
from controllers.auth_controller import register_user, login_user

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register/student', methods=['POST'])
def register_student():
    data = request.get_json()
    return register_user('student', data)


@auth_bp.route('/register/admin', methods=['POST'])
def register_admin():
    data = request.get_json()
    return register_user('admin', data)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return login_user(data)
