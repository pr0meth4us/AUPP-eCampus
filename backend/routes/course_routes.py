from flask import Blueprint
from controllers.course_controller import CourseController

course_bp = Blueprint('course', __name__)


@course_bp.route('/', methods=['POST'])
def create_course():
    return CourseController.create_course()


@course_bp.route('/', methods=['GET'])
def get_all_courses():
    return CourseController.get_all_courses()


@course_bp.route('/<course_id>', methods=['PUT'])
def update_course(course_id):
    return CourseController.update_course(course_id)


@course_bp.route('/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    return CourseController.delete_course(course_id)
