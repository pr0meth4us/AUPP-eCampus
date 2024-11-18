from .auth_middleware import token_required
from functools import wraps
from flask import jsonify, g


def own_profile_required(f):
    @wraps(f)
    @token_required
    def decorated_function(*args, **kwargs):
        student_id = kwargs.get('student_id')
        if not student_id:
            return jsonify({'message': 'Student ID not found in request'}), 400

        if str(g.current_user['_id']) != str(student_id):
            return jsonify({'message': 'You can only access your own profile'}), 403

        return f(*args, **kwargs)
    return decorated_function
