from flask import jsonify

from models.course import Course
from models.user_model import Admin, Instructor, User, Student


class AdminController:

    @staticmethod
    def get_all_users():
        users = Admin.get_all_users()
        return jsonify(users), 200

    @staticmethod
    def get_all_courses():
        courses = Course.get_all()
        return jsonify(courses), 200

    @staticmethod
    def delete_user(user_id):
        Admin.delete_user(user_id)
        return jsonify({"message": "User deleted successfully."}), 200

    @staticmethod
    def update_user(user_id, new_name=None, new_email=None, new_password=None):
        Admin.update_user(user_id, new_name, new_email, new_password)
        return jsonify({"message": "User updated successfully."}), 200

    @staticmethod
    def admin_register(email, role, name, password):
        if User.find_by_email(email):
            return jsonify({'message': 'Email already exists.'}), 409
        user_classes = {'student': Student, 'instructor': Instructor, 'admin': Admin}
        user_class = user_classes.get(role)
        user = user_class(name=name, email=email, password=password)
        user.save_to_db()
        return jsonify({'message': f'{role.capitalize()} registered successfully'}), 201
