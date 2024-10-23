import requests
from flask import request, jsonify, current_app, g
from functools import wraps
from utils.token_utils import decode_token, get_token_from_request


def verify_recaptcha(recaptcha_response):
    """Function to verify reCAPTCHA response with Google API."""
    secret_key = current_app.config['RECAPTCHA_SECRET_KEY']
    payload = {
        'secret': secret_key,
        'response': recaptcha_response
    }
    response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)
    result = response.json()
    return result.get('success', False)


def token_required(f):
    """Base middleware for token verification and user loading."""
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
