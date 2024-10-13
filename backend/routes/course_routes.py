from flask import Blueprint
from controllers.course_controller import CourseController
from middleware.admin_middleware import require_admin
from middleware.course_middleware import require_admin_or_instructor_or_uploader, require_admin_or_instructor

course_bp = Blueprint('course', __name__)


@course_bp.route('/', methods=['POST'])
@require_admin_or_instructor
def create_course():
    return CourseController.create_course()


@course_bp.route('/', methods=['GET'])
def get_all_courses():
    return CourseController.get_all_courses()


@course_bp.route('/<course_id>', methods=['PUT'])
@require_admin_or_instructor_or_uploader
def update_course(course_id):
    return CourseController.update_course(course_id)


@course_bp.route('/<course_id>', methods=['DELETE'])
@require_admin_or_instructor_or_uploader
def delete_course(course_id):
    return CourseController.delete_course(course_id)
