import jwt
from datetime import datetime, timedelta, UTC
from flask import request, current_app


def create_token(user):
    """Create a JWT token for a user."""
    payload = {
        '_id': str(user['_id']),
        'role': user['role'],
        'exp': datetime.now(UTC) + timedelta(hours=1)
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')


def decode_token(token):
    """Decode and verify a JWT token."""
    try:
        return jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def get_token_from_request():
    """Extract token from either Authorization header or cookies."""
    # Try Authorization header first
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]

    # Fall back to cookies
    return request.cookies.get('auth_token')
