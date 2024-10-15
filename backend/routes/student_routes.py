from flask import Blueprint
from controllers.student_controller import StudentController
from middleware.profile_middleware import own_profile_required

student_bp = Blueprint('student', __name__)

@student_bp.route('/students', methods=['POST'])
def create_student():
    return StudentController.create_student_profile()

@student_bp.route('/students/<student_id>', methods=['GET'])
@own_profile_required  # Ensure users can only view their own profiles
def get_student(student_id):
    return StudentController.get_student_profile(student_id)

@student_bp.route('/students/<student_id>', methods=['PUT'])
@own_profile_required  # Ensure users can only update their own profiles
def update_student(student_id):
    return StudentController.update_student_profile(student_id)

@student_bp.route('/students/<student_id>', methods=['DELETE'])
@own_profile_required  # Ensure users can only delete their own profiles
def delete_student(student_id):
    return StudentController.delete_student_profile(student_id)

@student_bp.route('/students/<student_id>/upload-image', methods=['POST'])
@own_profile_required  # Ensure users can only upload images for their own profiles
def upload_student_image(student_id):
    return StudentController.upload_profile_image(student_id)  # Ensure this method exists in your controller