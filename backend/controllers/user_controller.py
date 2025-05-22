from flask import jsonify, request, g
from models.user_model import User
from services.aws_service import upload_to_s3


class UserController:
    @staticmethod
    def get_profile(user_id):
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        data = user.to_dict()
        data.pop('password_hash')
        return jsonify(data), 200

    @staticmethod
    def update_profile(user_id):
        if str(g.current_user['_id']) != user_id and g.current_user['role'] != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        data = request.json
        try:
            user.update(**data)
            return jsonify({'message': 'Profile updated successfully'}), 200
        except ValueError as e:
            return jsonify({'message': str(e)}), 400

    @staticmethod
    def upload_profile_image(user_id):
        if str(g.current_user['_id']) != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        image_file = request.files.get('image')
        if not image_file:
            return jsonify({'message': 'No image provided'}), 400
        image_path = upload_to_s3(image_file, f"profiles/{user_id}/{image_file.filename}")
        user = User.find_by_id(user_id)
        user.update(profile_image=image_path)
        return jsonify({'message': 'Image uploaded', 'image_path': image_path}), 200

    @staticmethod
    def delete_user(user_id):
        if g.current_user['role'] != 'admin' and str(g.current_user['_id']) != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        user.delete()
        return jsonify({'message': 'User deleted successfully'}), 200

    @staticmethod
    def get_all_users():
        if g.current_user['role'] != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        users = User.get_all()
        return jsonify(users), 200

    @staticmethod
    def search_users():
        query = request.args.get('q', '')
        role = request.args.get('role')
        users = User.search_users(query, role)
        return jsonify([u.to_dict() for u in users]), 200
