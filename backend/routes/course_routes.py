from flask import Blueprint, jsonify
from controllers.course_controller import CourseController
from middleware.course_middleware import require_admin_or_instructor_or_uploader, require_admin_or_instructor
from middleware.admin_middleware import require_admin
from models.course_model import Major, Tag
from middleware.payment_middleware import payment_required

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


@course_bp.route('/major', methods=['POST'])
@require_admin
def create_major():
    return CourseController.create_major()


@course_bp.route('/majors', methods=['GET'])
def get_all_majors():
    majors = Major.get_all()
    return jsonify([
        {
            'id': str(major._id),
            'name': major.name
        } for major in majors
    ]), 200


@course_bp.route('/tags', methods=['GET'])
def get_all_tags():
    tags = Tag.get_all()
    return jsonify([
        {
            'id': str(tag._id),
            'name': tag.name
        } for tag in tags
    ]), 200


@course_bp.route('/<course_id>/material', methods=['GET'])
@payment_required
def get_course_material(course_id):
    # Logic to retrieve course material
    return jsonify({"material": "This is the paid course material."})