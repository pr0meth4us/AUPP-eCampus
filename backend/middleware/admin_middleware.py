from functools import wraps
from flask import g, jsonify
from .auth_middleware import token_required


def require_admin(f):
    """Middleware to ensure user is an admin."""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if g.current_user['role'] != 'admin':
            return jsonify({'message': 'Unauthorized. Admins only.'}), 403
        return f(*args, **kwargs)
    return decorated
