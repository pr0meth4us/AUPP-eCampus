from models import User
from flask import jsonify


def get_all_users():
    try:
        users = User.get_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
