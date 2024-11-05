from flask import g, jsonify
from functools import wraps
from models.course_model import Course
from .auth_middleware import token_required


def require_admin_or_instructor(f):
    """Middleware to ensure user is an admin or instructor."""

    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        print(g.current_user['role'])
        print(g)
        print(g.current_user)
        if g.current_user['role'] not in ['admin', 'instructor']:
            print('true')
            return jsonify({'message': 'Unauthorized. Admins or Instructors only.'}), 403
        return f(*args, **kwargs)
    print(decorated)

    return decorated


def require_admin_or_instructor_or_uploader(f):
    """Middleware to ensure user is an admin, instructor, or course uploader."""

    @wraps(f)
    @token_required
    def decorated(course_id, *args, **kwargs):
        course = Course.find_by_id(course_id)
        if not course:
            return jsonify({'message': 'Course not found'}), 404

        user_id = g.current_user['_id']
        user_role = g.current_user['role']

        if (user_role != 'admin' and
                user_id != str(course['instructor_id']) and
                user_id != str(course['uploader_id'])):
            return jsonify(
                {'message': 'Unauthorized. Only admins, the instructor, or the uploader can perform this action.'}), 403

        g.course = course
        return f(course_id, *args, **kwargs)

    return decorated
