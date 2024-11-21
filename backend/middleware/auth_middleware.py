import requests
from flask import request, jsonify, current_app, g
from functools import wraps
from utils.token_utils import decode_token, get_token_from_request

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()

        if not token:
            return jsonify({'message': 'Authentication token is missing'}), 401

        payload = decode_token(token)
        if not payload:
            return jsonify({'message': 'Invalid or expired token'}), 401

        g.current_user = payload
        request.user = payload

        return f(*args, **kwargs)
    return decorated
