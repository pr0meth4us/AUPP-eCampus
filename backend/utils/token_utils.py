import jwt
import datetime
from flask import current_app
from config import Config


def create_token(user):
    secret_key = current_app.config['SECRET_KEY']

    payload = {
        'user_id': user['_id'],
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }

    return jwt.encode(payload, secret_key, algorithm='HS256')


def extract_role_from_token(token):
    try:
        decoded = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        return decoded['role']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
