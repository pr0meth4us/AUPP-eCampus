from functools import wraps
from bson.errors import InvalidId
from flask import g, jsonify
from models.course import Assignment, Course
from .auth_middleware import token_required


def require_admin_or_instructor(f):
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if g.current_user['role'] not in ['admin', 'instructor']:
            return jsonify({'message': 'Unauthorized. Admins or Instructors only.'}), 403
        return f(*args, **kwargs)

    return decorated


def require_admin_or_instructor_or_uploader(f):
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        assignment_id = kwargs.get('assignment_id', None)

        if assignment_id:
            try:
                course_id = Assignment.get_course_id(assignment_id)
            except ValueError as e:
                return jsonify({'message': str(e)}), 400
        else:
            course_id = kwargs.get('course_id')

        course = Course.find_by_id(course_id)
        if not course:
            return jsonify({'message': 'Course not found.'}), 404

        user_id = str(g.current_user['_id'])
        user_role = g.current_user['role']

        if (
                user_role != 'admin' and
                user_id != str(course['instructor_id']) and
                user_id != str(course['uploader_id'])
        ):
            return jsonify({'message': 'Unauthorized. Only admins, the instructor, or the uploader can perform this action.'}), 403

        g.course = course
        return f(*args, **kwargs)

    return decorated
