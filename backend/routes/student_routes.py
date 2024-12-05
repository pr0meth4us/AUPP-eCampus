from flask import Blueprint, request
from controllers.student_controller import StudentController
from middleware.profile_middleware import own_profile_required
from datetime import datetime, timezone

student_bp = Blueprint('student', __name__)


@student_bp.route('/<student_id>', methods=['GET'])
@own_profile_required
def get_student(student_id):
    return StudentController.get_student_profile(student_id)


@student_bp.route('/<student_id>', methods=['PUT'])
@own_profile_required
def update_student(student_id):
    data = request.json
    updated_data = {
        "name": data.get("name"),
        "email": data.get("email"),
        "bio": data.get("bio"),
        "courses_enrolled": data.get("courses_enrolled"),
        "password": data.get("password"),
        "updated_at": datetime.now(timezone.utc)
    }

    return StudentController.update_student_profile(updated_data, student_id)


@student_bp.route('/<student_id>', methods=['DELETE'])
@own_profile_required
def delete_student(student_id):
    return StudentController.delete_student_profile(student_id)


@student_bp.route('/<student_id>/upload-image', methods=['POST'])
@own_profile_required
def upload_student_image(student_id):
    image_file = request.files['image']
    return StudentController.upload_profile_image(student_id, image_file)
