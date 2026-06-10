from functools import wraps
from flask import request, jsonify, g
from app.utils.token_utils import get_token_from_request
from app.services.bifrost_service import BifrostService
from app.models.user_model import User # Assuming you have a User model for local sync

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            return jsonify({'message': 'Authentication required'}), 401

        # Delegate validation to Bifrost
        bifrost_session = BifrostService.validate_token(token)
        if not bifrost_session or not bifrost_session.get('valid'):
            return jsonify({'message': 'Session expired or invalid'}), 401

        # Sync/Find local user info
        user_data = bifrost_session.get('user')
        g.current_user = user_data
        return f(*args, **kwargs)
    return decorated