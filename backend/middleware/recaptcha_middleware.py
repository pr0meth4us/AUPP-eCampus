import requests
from flask import request, jsonify
from functools import wraps
from config import Config


def verify_recaptcha(recaptcha_response):
    """Verify reCAPTCHA response with Google API."""
    try:
        payload = {
            'secret': Config.RECAPTCHA_SECRET_KEY,
            'response': recaptcha_response
        }
        response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data=payload,
            timeout=5
        )
        return response.json().get('success', False)
    except:
        return False


def require_recaptcha(f):
    """Middleware to enforce reCAPTCHA verification on certain routes."""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip recaptcha for non-browser requests
        if not request.headers.get('Origin'):
            return f(*args, **kwargs)

        recaptcha_response = request.json.get('recaptcha_response')
        if not recaptcha_response:
            return jsonify({'message': 'reCAPTCHA response is required'}), 400

        if not verify_recaptcha(recaptcha_response):
            return jsonify({'message': 'reCAPTCHA verification failed'}), 400

        return f(*args, **kwargs)

    return decorated_function
