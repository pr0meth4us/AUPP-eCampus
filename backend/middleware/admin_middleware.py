from flask import request, jsonify, g
from functools import wraps

from models import User


def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('auth_token')
        if not token:
            return jsonify({'message': 'Authentication token is missing.'}), 401

        user = User.find_by_token(token)
        if not user or user['role'] != 'admin':
            return jsonify({'message': 'Unauthorized. Admins only.'}), 403

        g.user = user
        return f(*args, **kwargs)

    return decorated_function
