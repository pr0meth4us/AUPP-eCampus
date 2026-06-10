from flask import jsonify, request, make_response, g
from app.models.user_model import User
from app.services.bifrost_service import BifrostService

class AuthController:
    @staticmethod
    def sync_session():
        """
        Called by Frontend after redirect from Bifrost.
        1. Validates the JWT with Bifrost.
        2. Ensures the user exists in AUPP's local DB (Sync).
        3. Returns the local user profile.
        """
        # 1. Get Token from Header
        auth_header = request.headers.get('Authorization')
        token = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'message': 'Missing token'}), 401

        # 2. Validate with Bifrost Server
        bifrost_data = BifrostService.validate_token(token)

        if not bifrost_data or not bifrost_data.get('is_valid'):
            return jsonify({'message': 'Invalid or expired Bifrost token'}), 401

        # 3. Extract Data
        account_id = bifrost_data['account_id']
        email = bifrost_data.get('email')
        # Use role from Bifrost if available, else default to student
        role = bifrost_data.get('app_specific_role', 'student')

        # 4. Sync to Local DB (Upsert)
        user = User.find_by_id(account_id)

        if not user:
            # First time login on AUPP -> Create Profile
            user = User(
                _id=account_id,
                email=email,
                name=email.split('@')[0], # Default name from email
                role=role
            )
            user.save() # Uses the new upsert logic
        else:
            # Existing user -> Sync role if changed
            if user.role != role:
                user.role = role
                user.save()

        # 5. Return Response
        response = make_response(jsonify({
            'message': 'Session synced',
            'user': user.to_dict()
        }), 200)

        return response

    @staticmethod
    def logout():
        response = make_response(jsonify({"message": "Logged out successfully"}), 200)
        return response

    @staticmethod
    def check_auth():
        # If request hits this controller, middleware has already validated the token
        if hasattr(g, 'current_user'):
            return jsonify({"authenticated": True, "user": g.current_user}), 200
        return jsonify({"authenticated": False, "message": "Not authenticated"}), 401