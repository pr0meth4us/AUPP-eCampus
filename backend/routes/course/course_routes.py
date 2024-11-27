from flask import Blueprint, jsonify, request
from controllers.course import CourseController, TagController, MajorController
from middleware.course_middleware import require_admin_or_instructor_or_uploader, require_admin_or_instructor
from middleware.payment_middleware import payment_required
from services.mongo_service import db
from bson import ObjectId
course_bp = Blueprint('course', __name__)


# === Course Routes ===
@course_bp.route('/', methods=['POST'])
@require_admin_or_instructor
def create_course():
    return CourseController.create_course()


@course_bp.route('/', methods=['GET'])
def get_all_courses():
    return CourseController.preview_courses()


@course_bp.route('/<course_id>', methods=['PUT'])
@require_admin_or_instructor_or_uploader
def update_course(course_id):
    return CourseController.update_course(course_id)


@course_bp.route('/<course_id>', methods=['DELETE'])
@require_admin_or_instructor_or_uploader
def delete_course(course_id):
    return CourseController.delete_course(course_id)


@course_bp.route('/<course_id>', methods=['GET'])
def get_course_by_id(course_id):
    return CourseController.get_course_by_id(course_id)


@course_bp.route('/<course_id>/material', methods=['GET'])
@payment_required
def get_course_material(course_id):
    # Logic to retrieve course material
    return jsonify({"material": "This is the paid course material."})


@course_bp.route('/<course_id>/enroll', methods=['POST'])
@payment_required
def enroll_student(course_id):
    return CourseController.enroll_student(course_id)


@course_bp.route('/<course_id>/unroll', methods=['POST'])
def unenroll_student(course_id):
    student_id = request.json.get('student_id')
    if not student_id:
        return jsonify({'message': 'Student ID is required.'}), 400
    return CourseController.unenroll_student(course_id, student_id)


@course_bp.route('/tags', methods=['POST'])
def create_tags():
    tag_names = request.json.get('names', [])
    if not tag_names or not isinstance(tag_names, list):
        return jsonify({'message': 'Tag names must be a list.'}), 400

    tag_ids = TagController.find_or_create_tags(tag_names)
    return jsonify({'message': 'Tags created or found.', 'tag_ids': [str(tag_id) for tag_id in tag_ids]}), 201


@course_bp.route('/tags', methods=['GET'])
def get_all_tags():
    tags = TagController.get_all_tags()
    return jsonify(tags), 200


@course_bp.route('/tags/<tag_id>', methods=['PUT'])
def update_tag(tag_id):
    name = request.json.get('name')
    if not name:
        return jsonify({'message': 'Tag name is required.'}), 400

    success = TagController.update_tag(tag_id, name)
    return jsonify({'message': 'Tag updated.' if success else 'Tag not found.'}), 200


@course_bp.route('/tags/<tag_id>', methods=['DELETE'])
def delete_tag(tag_id):
    success = TagController.delete_tag(tag_id)
    return jsonify({'message': 'Tag deleted.' if success else 'Tag not found.'}), 200


@course_bp.route('/majors', methods=['POST'])
def create_majors():
    major_names = request.json.get('names', [])
    if not major_names or not isinstance(major_names, list):
        return jsonify({'message': 'Major names must be a list.'}), 400

    major_ids = MajorController.find_or_create_majors(major_names)
    return jsonify({'message': 'Majors created or found.', 'major_ids': [str(major_id) for major_id in major_ids]}), 201


@course_bp.route('/majors', methods=['GET'])
def get_all_majors():
    majors = MajorController.get_all_majors()
    return jsonify(majors), 200


@course_bp.route('/majors/<major_id>', methods=['PUT'])
def update_major(major_id):
    name = request.json.get('name')
    if not name:
        return jsonify({'message': 'Major name is required.'}), 400

    success = MajorController.update_major(major_id, name)
    return jsonify({'message': 'Major updated.' if success else 'Major not found.'}), 200


@course_bp.route('/majors/<major_id>', methods=['DELETE'])
def delete_major(major_id):
    success = MajorController.delete_major(major_id)
    return jsonify({'message': 'Major deleted.' if success else 'Major not found.'}), 200


@course_bp.route('/<course_id>/details', methods=['GET'])
@payment_required
def get_course_details_with_names(course_id):
    try:
        course = db.courses.find_one({"_id": ObjectId(course_id)})

        if not course:
            return jsonify({"error": "Course not found"}), 404

        course_data, status_code = CourseController.get_course_details_with_names(course_id)
        return jsonify(course_data), status_code
    except Exception as e:
        return jsonify({
            "error": "Unexpected server error",
            "details": str(e)
        }), 500

