from functools import wraps
from flask import request, jsonify, g
from services.bifrost_service import BifrostService
from models.user_model import User


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check Header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        # Check Cookie (Fallback)
        if not token:
            token = request.cookies.get('auth_token')

        if not token:
            return jsonify({'message': 'Authentication token missing'}), 401

        # Validate with Bifrost
        # Note: In high-traffic prod, we would cache this validation in Redis for ~60s
        bifrost_data = BifrostService.validate_token(token)

        if not bifrost_data or not bifrost_data.get('is_valid'):
            return jsonify({'message': 'Invalid or expired token'}), 401

        # Token is valid. Fetch local user profile to attach to request context
        user_id = bifrost_data['account_id']
        local_user = User.find_by_id(user_id)

        if not local_user:
            # Edge case: Token valid, but local profile deleted or not synced yet.
            return jsonify({'message': 'User profile not found. Please re-login.'}), 401

        g.current_user = local_user.to_dict()
        return f(*args, **kwargs)

    return decorated