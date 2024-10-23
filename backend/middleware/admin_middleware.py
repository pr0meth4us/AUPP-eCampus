from functools import wraps
from flask import request, jsonify
from utils.token_utils import extract_role_from_token


def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('auth_token')

        if not token:
            return jsonify({'message': 'Authentication token is missing.'}), 401

        role, _id = extract_role_from_token(token)
        if not role or role != 'admin':
            return jsonify({'message': 'Unauthorized. Admins only.'}), 403

        return f(*args, **kwargs)

    return decorated_function
