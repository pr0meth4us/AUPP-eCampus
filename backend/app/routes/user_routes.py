from flask import Blueprint
from app.controllers.user_controller import UserController
from app.middleware.auth_middleware import login_required
from app.middleware.admin_middleware import require_admin

user_bp = Blueprint('users', __name__)

@user_bp.route('/<user_id>', methods=['GET'])
@login_required
def get_profile(user_id):
    return UserController.get_profile(user_id)


@user_bp.route('/<user_id>', methods=['PUT'])
@login_required
def update_profile(user_id):
    return UserController.update_profile(user_id)


@user_bp.route('/<user_id>/upload-image', methods=['POST'])
@login_required
def upload_profile_image(user_id):
    return UserController.upload_profile_image(user_id)


@user_bp.route('/<user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    return UserController.delete_user(user_id)


@user_bp.route('/all', methods=['GET'])
@login_required
@require_admin
def get_all_users():
    return UserController.get_all_users()


@user_bp.route('/search', methods=['GET'])
@login_required
def search_users():
    return UserController.search_users()
