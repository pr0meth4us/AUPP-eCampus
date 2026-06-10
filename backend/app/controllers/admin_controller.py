from flask import jsonify
from app.models.user_model import User
from app.models.course_model import Course  # Assuming this is still a separate model

class AdminController:
    @staticmethod
    def get_all_users():
        # Use User.get_all() to fetch all users, optionally filtered by role if needed
        users = User.get_all()
        return jsonify(users), 200

    @staticmethod
    def delete_user(user_id):
        # Find and delete a user by ID using the User class
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({"message": "User not found."}), 404
        user.delete()
        return jsonify({"message": "User deleted successfully."}), 200

    @staticmethod
    def update_user(user_id, new_name=None, new_email=None, new_password=None):
        # Find and update a user by ID
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({"message": "User not found."}), 404
        update_data = {}
        if new_name:
            update_data['name'] = new_name
        if new_email:
            update_data['email'] = new_email
        if new_password:
            update_data['password'] = new_password
        try:
            user.update(**update_data)
            return jsonify({"message": "User updated successfully."}), 200
        except ValueError as e:
            return jsonify({"message": str(e)}), 400

    @staticmethod
    def admin_register(email, role, name, password):
        # Register a new user with the specified role
        if User.find_by_email(email):
            return jsonify({'message': 'Email already exists.'}), 409
        # Create a new User instance with the given role
        user = User(name=name, email=email, password=password, role=role)
        user.save()
        return jsonify({'message': f'{role.capitalize()} registered successfully'}), 201