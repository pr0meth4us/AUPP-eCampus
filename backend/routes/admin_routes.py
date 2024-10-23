from flask import Blueprint, request, jsonify
from services.cloudinary_service import retrieve_all_video_from_cloudinary, delete_from_cloudinary
from middleware.admin_middleware import require_admin
from controllers.admin_controller import get_all_users as fetch_all_users, delete_user, update_user, admin_register

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/getall', methods=['GET'])
@require_admin
def get_all_users():
    return fetch_all_users()


@admin_bp.route('/register', methods=['POST'])
def register_route():
    data = request.get_json()
    print(data)
    return admin_register(data)


@admin_bp.route('/delete-user/<user_id>', methods=['DELETE'])
@require_admin
def delete_user_route(user_id):
    return delete_user(user_id)


@admin_bp.route('/update-user/<user_id>', methods=['PUT'])
@require_admin
def update_user_route(user_id):
    return update_user(user_id)


@admin_bp.route('/get-video', methods=['GET'])
@require_admin
def get_video():
    return retrieve_all_video_from_cloudinary()


@admin_bp.route('/delete-video/<video_id>', methods=['DELETE'])
@require_admin
def delete_video_route(video_id):
    try:
        delete_from_cloudinary(video_id)
        return jsonify({"message": "Video deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
