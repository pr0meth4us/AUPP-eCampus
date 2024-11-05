import jwt
from datetime import datetime, timedelta, UTC
from flask import request, current_app


def create_token(user):
    payload = {
        '_id': str(user['_id']),
        'role': user['role'],
        'exp': datetime.now(UTC) + timedelta(hours=1)
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')


def decode_token(token):
    try:
        return jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def get_token_from_request():

    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]

    return request.cookies.get('auth_token')
