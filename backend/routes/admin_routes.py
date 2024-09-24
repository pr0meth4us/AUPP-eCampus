from flask import Blueprint, request
from middleware.admin_middleware import require_admin
from controllers.auth_controller import register
from controllers.admin_controller import get_all_users as fetch_all_users

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/getall', methods=['GET'])
@require_admin
def get_all_users():
    return fetch_all_users()


@admin_bp.route('/instructor-register', methods=['POST'])
@require_admin
def register_instructor():
    data = request.get_json()
    return register(data)
