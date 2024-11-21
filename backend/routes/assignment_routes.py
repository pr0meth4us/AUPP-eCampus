from flask import Blueprint, request
from controllers.course.assignment_controller import AssignmentController
from middleware.course_middleware import require_admin_or_instructor_or_uploader

assignment_bp = Blueprint('assignments', __name__)


@assignment_bp.route('', methods=['POST'])
@require_admin_or_instructor_or_uploader
def add_assignment(course_id):
    data = request.form.to_dict()
    file = request.files.get('file')
    if file:
        data['file'] = file
    return AssignmentController.add_assignment(course_id, data)


@assignment_bp.route('', methods=['GET'])
def get_assignments(course_id):
    return AssignmentController.get_assignments(course_id)


@assignment_bp.route('/<assignment_id>', methods=['GET'])
def get_assignment(assignment_id):
    return AssignmentController.get_assignment_by_id(assignment_id)


@assignment_bp.route('/<assignment_id>', methods=['DELETE'])
def delete_assignment(assignment_id):
    return AssignmentController.delete_assignment(assignment_id)
