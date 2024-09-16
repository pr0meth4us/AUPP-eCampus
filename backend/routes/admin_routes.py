from flask import Blueprint, request
from middleware.admin_middleware import require_admin
from controllers.auth_controller import register_user

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/instructor-register', methods=['POST'])
@require_admin
def register_instructor():
    data = request.get_json()
    return register_user('instructor', data)