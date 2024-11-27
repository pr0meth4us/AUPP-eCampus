from flask import Blueprint, request, jsonify

from controllers.admin_controller import get_all_users as fetch_all_users, delete_user, update_user, admin_register
from controllers.course import course_controller
from middleware.admin_middleware import require_admin
from services.cloudinary_service import retrieve_all_video_from_cloudinary, delete_from_cloudinary

admin_bp = Blueprint('admin', __name__)


@admin_bp.before_request
def enforce_admin_access():
    require_admin(lambda: None)


@admin_bp.route('/getall', methods=['GET'])
def get_all_users():
    return fetch_all_users()


@admin_bp.route('/register', methods=['POST'])
def register_route():
    data = request.get_json()
    return admin_register(data)


@admin_bp.route('/delete-user/<user_id>', methods=['DELETE'])
def delete_user_route(user_id):
    return delete_user(user_id)


@admin_bp.route('/update-user/<user_id>', methods=['PUT'])
def update_user_route(user_id):
    return update_user(user_id)


@admin_bp.route('/get-video', methods=['GET'])
def get_video():
    return retrieve_all_video_from_cloudinary()


@admin_bp.route('/delete-video/<video_id>', methods=['DELETE'])
def delete_video_route(video_id):
    try:
        delete_from_cloudinary(video_id)
        return jsonify({"message": "Video deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/courses', methods=['GET'])
def get_all_courses():
    return course_controller.CourseController.get_all_courses()
