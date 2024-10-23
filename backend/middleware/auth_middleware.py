import requests
from flask import request, jsonify, current_app
from functools import wraps
from config import Config
import jwt


def verify_recaptcha(recaptcha_response):
    secret_key = Config.RECAPTCHA_SECRET_KEY
    verify_url = 'https://www.google.com/recaptcha/api/siteverify'
    data = {
        'secret': secret_key,
        'response': recaptcha_response
    }
    response = requests.post(verify_url, data=data)
    result = response.json()
    return result.get('success', False)


def require_recaptcha(f):
    """Middleware to enforce reCAPTCHA verification on certain routes."""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        origin = request.headers.get('Origin')
        if origin is None:
            return f(*args, **kwargs)
        recaptcha_response = request.json.get('recaptcha_response')
        if not recaptcha_response:
            return jsonify({'message': 'reCAPTCHA response is required.'}), 400

        if not verify_recaptcha(recaptcha_response):
            return jsonify({'message': 'reCAPTCHA verification failed.'}), 400

        return f(*args, **kwargs)

    return decorated_function


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


def require_auth(f):
    """Middleware to ensure that a user is authenticated."""

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization'].split(" ")
            if len(auth_header) == 2 and auth_header[0] == 'Bearer':
                token = auth_header[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            request.user = payload

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(*args, **kwargs)

    return decorated
