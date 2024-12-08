from flask import Blueprint, jsonify, request, g
from controllers.course import CourseController, TagController, MajorController
from middleware.course_middleware import require_admin_or_instructor_or_uploader, require_admin_or_instructor
from middleware.payment_middleware import payment_required
from bson import ObjectId

course_bp = Blueprint('course', __name__)


@course_bp.route('/', methods=['POST'])
@require_admin_or_instructor
def create_course():
    title = request.form.get('title')
    description = request.form.get('description')
    instructor_id = request.form.get('instructor_id')
    price = request.form.get('price')
    tag_names = request.form.getlist('tag_names')
    major_ids = [ObjectId(mid) for mid in request.form.getlist('major_ids')]
    cover_image = request.files.get('cover_image') if 'cover_image' in request.files else None

    return CourseController.create_course(
        title=title,
        description=description,
        instructor_id=instructor_id,
        price=price,
        tag_names=tag_names,
        major_ids=major_ids,
        cover_image=cover_image
    )


@course_bp.route('/', methods=['GET'])
def get_all_courses():
    return CourseController.get_all_course_preview()


@course_bp.route('/<course_id>', methods=['PUT'])
@require_admin_or_instructor_or_uploader
def update_course(course_id):
    title = request.form.get('title')
    description = request.form.get('description')
    instructor_id = request.form.get('instructor_id')
    tag_names = request.form.getlist('tag_names')
    major_ids = [ObjectId(mid) for mid in request.form.getlist('major_ids')]

    return CourseController.update_course(
        course_id=course_id,
        title=title,
        description=description,
        instructor_id=instructor_id,
        tag_names=tag_names,
        major_ids=major_ids
    )


@course_bp.route('/<course_id>', methods=['DELETE'])
@require_admin_or_instructor_or_uploader
def delete_course(course_id):
    return CourseController.delete_course(course_id)


@course_bp.route('/<course_id>', methods=['GET'])
def get_course_by_id(course_id):
    return CourseController.get_course_by_id(course_id)


# @course_bp.route('/<course_id>/material', methods=['GET'])
# @payment_required
# def get_course_material(course_id):
#     return CourseController.get_course_material(course_id)


@course_bp.route('/<course_id>/enroll', methods=['POST'])
@payment_required
def enroll_student(course_id, has_access=False):
    student_id = g.current_user['_id']
    if not has_access:
        return jsonify({"message": "Payment required to enroll"}), 403
    return CourseController.enroll_student(course_id, student_id)

@course_bp.route('/<course_id>/unroll', methods=['POST'])
def unenroll_student(course_id):
    student_id = request.json.get('student_id')
    if not student_id:
        return jsonify({'message': 'Student ID is required.'}), 400
    return CourseController.unenroll_student(course_id, student_id)


# @course_bp.route('/tags', methods=['POST'])
# def create_tags():
#     tag_names = request.json.get('names', [])
#     return TagController.create_tags(tag_names)


@course_bp.route('/tags', methods=['GET'])
def get_all_tags():
    return TagController.get_all_tags()


@course_bp.route('/tags/<tag_id>', methods=['PUT'])
def update_tag(tag_id):
    name = request.json.get('name')
    return TagController.update_tag(tag_id, name)


@course_bp.route('/tags/<tag_id>', methods=['DELETE'])
def delete_tag(tag_id):
    return TagController.delete_tag(tag_id)


# @course_bp.route('/majors', methods=['POST'])
# def create_majors():
#     major_names = request.json.get('names', [])
#     return CourseController.create_majors(major_names)


@course_bp.route('/majors', methods=['GET'])
def get_all_majors():
    return MajorController.get_all_majors()


@course_bp.route('/majors/<major_id>', methods=['PUT'])
def update_major(major_id):
    name = request.json.get('name')
    return MajorController.update_major(major_id, name)


@course_bp.route('/majors/<major_id>', methods=['DELETE'])
def delete_major(major_id):
    return MajorController.delete_major(major_id)


@course_bp.route('/<course_id>/details', methods=['GET'])
@payment_required
def get_course_details_with_names(course_id, has_access):
    student_id = None
    if hasattr(g, 'current_user') and g.current_user:
        student_id = g.current_user.get('_id', None)
        print(g.current_user, "jkj")

    return CourseController.get_course_details(course_id, student_id, has_access)


@course_bp.route('/<course_id>/preview', methods=['GET'])
def get_course_preview(course_id):
    return CourseController.get_course_preview(course_id)
