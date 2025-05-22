from flask import Blueprint
from controllers.course_controller import CourseController
from middleware.auth_middleware import login_required
from middleware.course_middleware import require_admin_or_instructor_or_uploader
from middleware.payment_middleware import payment_required

course_bp = Blueprint('course', __name__)


@course_bp.route('/', methods=['POST'])
def create_course():
    return CourseController.create_course()


@course_bp.route('/<course_id>', methods=['GET'])
def get_course(course_id):
    return CourseController.get_course(course_id)


@course_bp.route('/<course_id>', methods=['PUT'])
def update_course(course_id):
    return CourseController.update_course(course_id)


@course_bp.route('/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    return CourseController.delete_course(course_id)


@course_bp.route('/', methods=['GET'])
def get_all_courses():
    return CourseController.get_all_courses()


@course_bp.route('/my', methods=['GET'])
@login_required  #
def get_my_courses():
    return CourseController.get_my_courses()


@course_bp.route('/<course_id>/preview', methods=['GET'])
def preview_course(course_id):
    return CourseController.preview_course(course_id)


@course_bp.route('/<course_id>/detail', methods=['GET'])
@login_required
@payment_required
def detail_course(course_id, has_access=False):
    return CourseController.detail_course(course_id, has_access=has_access)


@course_bp.route('/<course_id>/full', methods=['GET'])
@login_required
@require_admin_or_instructor_or_uploader
def full_course(course_id):
    return CourseController.full_course(course_id)
