import jwt
import datetime
from flask import current_app


def create_token(user):
    secret_key = current_app.config['SECRET_KEY']

    payload = {
        '_id': str(user['_id']),  # Ensure _id is string if it's an ObjectId
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }

    return jwt.encode(payload, secret_key, algorithm='HS256')


def extract_role_from_token(token):
    try:
        secret_key = current_app.config['SECRET_KEY']
        decoded = jwt.decode(token, secret_key, algorithms=['HS256'])
        return decoded['role']
    except jwt.ExpiredSignatureError:
        # Token has expired
        return None
    except jwt.InvalidTokenError:
        # Token is invalid (for example, due to being tampered with)
        return None
