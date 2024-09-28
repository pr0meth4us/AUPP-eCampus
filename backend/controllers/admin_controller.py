from flask import jsonify, request
from models.user_model import Admin, Instructor, User


def get_all_users():
    try:
        users = Admin.get_all_users()
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


def register_instructor(data):
    email = data.get('email')
    if User.find_by_email(email):
        return jsonify({'message': 'Email already exists.'}), 409
    name = data.get('name')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'message': 'Name, email, and password are required.'}), 400

    user_class = Instructor
    user = user_class(name=name, email=email, password=password)
    user.save_to_db()

    return jsonify({'message': 'Instructor registered successfully'}), 201
