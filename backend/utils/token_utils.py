import jwt
import datetime
from flask import current_app


def create_token(user):
    secret_key = current_app.config['SECRET_KEY']

    payload = {
        'user_id': user['_id'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }

    return jwt.encode(payload, secret_key, algorithm='HS256')
