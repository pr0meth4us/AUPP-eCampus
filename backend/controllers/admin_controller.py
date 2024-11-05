from flask import jsonify, request
from models.user_model import Admin, Instructor, User, Student


def get_all_users():
    users = Admin.get_all_users()
    return jsonify(users), 200


def delete_user(user_id):
    Admin.delete_user(user_id)
    return jsonify({"message": "User deleted successfully."}), 200


def update_user(user_id):
    data = request.get_json()
    new_name = data.get('name')
    new_email = data.get('email')
    new_password = data.get('password')
    Admin.update_user(user_id, new_name, new_email, new_password)
    return jsonify({"message": "User updated successfully."}), 200



def admin_register(data):
    email = data.get('email')
    if User.find_by_email(email):
        return jsonify({'message': 'Email already exists.'}), 409
    role = data.get('role')
    user_classes = {'student': Student, 'instructor': Instructor, 'admin': Admin}
    user_class = user_classes.get(role)
    user = user_class(name=data['name'], email=email, password=data['password'])
    user.save_to_db()
    return jsonify({'message': f'{role.capitalize()} registered successfully'}), 201
