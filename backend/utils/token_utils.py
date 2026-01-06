import jwt
from flask import request, current_app


def decode_token(token):
    try:
        # We still decode to check expiry locally,
        # but validation is primarily handled by BifrostService
        return jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
    except:
        return None


def get_token_from_request():
    # 1. Check HttpOnly Cookie (Highest Priority/Security)
    token = request.cookies.get('auth_token')

    # 2. Fallback to Authorization Header (For API testing/mobile)
    if not token:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

    return token