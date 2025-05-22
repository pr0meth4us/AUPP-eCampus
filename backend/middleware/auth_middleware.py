from functools import wraps
from flask import request, jsonify, g
from utils.token_utils import decode_token

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('auth_token')
        if not token:
            return jsonify({'message': 'Authentication token missing'}), 401
        payload = decode_token(token)
        if not payload:
            return jsonify({'message': 'Invalid or expired token'}), 401
        g.current_user = payload
        return f(*args, **kwargs)
    return decorated