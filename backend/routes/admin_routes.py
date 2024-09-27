from flask import Blueprint, request
from middleware.admin_middleware import require_admin
from controllers.admin_controller import get_all_users as fetch_all_users, delete_user, update_user, register_instructor

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/getall', methods=['GET'])
@require_admin
def get_all_users():
    return fetch_all_users()


@admin_bp.route('/instructor-register', methods=['POST'])
@require_admin
def register_instructor_route():
    data = request.get_json()
    return register_instructor(data)


@admin_bp.route('/delete-user/<user_id>', methods=['DELETE'])
@require_admin
def delete_user_route(user_id):
    return delete_user(user_id)


@admin_bp.route('/update-user/<user_id>', methods=['PUT'])
@require_admin
def update_user_route(user_id):
    return update_user(user_id)
