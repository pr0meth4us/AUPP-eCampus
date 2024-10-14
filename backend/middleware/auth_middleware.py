from functools import wraps
from flask import request, jsonify, current_app
import jwt
import requests

def require_recaptcha(f):
    """Middleware to enforce reCAPTCHA verification on certain routes."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        recaptcha_response = request.json.get('recaptcha_response')
        if not recaptcha_response or not verify_recaptcha(recaptcha_response):
            return jsonify({'message': 'Invalid reCAPTCHA. Please try again.'}), 400
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
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('auth_token')
        if not token:
            return jsonify({'message': 'Authentication token is missing.'}), 401

        try:
            # Decode the token using the secret key
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            # Optionally, you can attach the user's role to the request context
            request.user_role = payload.get('role')
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token. Authentication failed.'}), 401

        return f(*args, **kwargs)

    return decorated_function