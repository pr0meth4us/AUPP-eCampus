from functools import wraps
from flask import g, jsonify
from .auth_middleware import token_required


def require_admin(f):
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if g.current_user['role'] != 'admin':
            return jsonify({'message': 'UnauthorizedPage. Admins only.'}), 403
        return f(*args, **kwargs)
    return decorated
