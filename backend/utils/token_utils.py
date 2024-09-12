import jwt
import datetime
import os

SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')

def create_token(user):
    payload = {
        'user_id': user['_id'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')