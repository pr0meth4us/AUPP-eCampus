# routes/student_routes.py
from flask import Blueprint
from controllers.student_controller import StudentController

student_bp = Blueprint('student', __name__)

@student_bp.route('/students', methods=['POST'])
def create_student():
    return StudentController.create_student_profile()

@student_bp.route('/students/<student_id>', methods=['GET'])
def get_student(student_id):
    return StudentController.get_student_profile(student_id)

@student_bp.route('/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    return StudentController.update_student_profile(student_id)

@student_bp.route('/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    return StudentController.delete_student_profile(student_id)