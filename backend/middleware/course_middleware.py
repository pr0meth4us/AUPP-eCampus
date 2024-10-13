from flask import g, request, jsonify
from functools import wraps
from models.course_model import Course
from utils.token_utils import extract_role_from_token


def require_admin_or_instructor(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('auth_token')

        if not token:
            return jsonify({'message': 'Authentication token is missing.'}), 401

        role, user_id = extract_role_from_token(token)
        if not role or role not in ['admin', 'instructor']:
            return jsonify({'message': 'Unauthorized. Admins or Instructors only.'}), 403

        g.role = role
        g.user_id = user_id

        return f(*args, **kwargs)

    return decorated_function


def require_admin_or_instructor_or_uploader(f):
    @wraps(f)
    def decorated_function(course_id, *args, **kwargs):
        token = request.cookies.get('auth_token')

        if not token:
            return jsonify({'message': 'Authentication token is missing.'}), 401

        role, user_id = extract_role_from_token(token)

        course = Course.find_by_id(course_id)
        if not course:
            return jsonify({'message': 'Course not found'}), 404

        if role != 'admin' and user_id != str(course['instructor_id']) and user_id != str(course['uploader_id']):
            return jsonify({'message': 'Unauthorized. Only admins, the instructor, or the uploader can perform this action.'}), 403

        g.role = role
        g.user_id = user_id
        g.course = course

        return f(course_id, *args, **kwargs)

    return decorated_function
