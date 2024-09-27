from flask import jsonify, request
from models.user_model import User, Admin


def get_all_users():
    try:
        users = User.get_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def delete_user(user_id):
    try:
        Admin.delete_user(user_id)
        return jsonify({"message": "User deleted successfully."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def update_user(user_id):
    """Controller to update a user's information."""
    data = request.get_json()
    new_name = data.get('name')
    new_email = data.get('email')
    new_password = data.get('password')

    try:
        Admin.update_user(user_id, new_name, new_email, new_password)
        return jsonify({"message": "User updated successfully."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

