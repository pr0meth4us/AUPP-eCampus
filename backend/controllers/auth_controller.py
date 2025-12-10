from flask import jsonify, request, make_response, g
from models.user_model import User
from services.bifrost_service import BifrostService


class AuthController:
    @staticmethod
    def sync_session():
        """
        Called by the Frontend after receiving a JWT from Bifrost.
        1. Validates the JWT with Bifrost.
        2. Ensures the user exists in AUPP's local DB (Sync).
        3. Returns the local user profile.
        """
        # 1. Get Token
        auth_header = request.headers.get('Authorization')
        token = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'message': 'Missing token'}), 401

        # 2. Validate with Bifrost
        bifrost_data = BifrostService.validate_token(token)

        if not bifrost_data or not bifrost_data.get('is_valid'):
            return jsonify({'message': 'Invalid or expired Bifrost token'}), 401

        # Extract data from Bifrost response
        # bifrost_data = { is_valid: True, account_id: "...", app_specific_role: "...", email: "..." }
        account_id = bifrost_data['account_id']
        email = bifrost_data.get('email')
        role = bifrost_data.get('app_specific_role', 'student')  # Default to student if role missing

        # 3. Sync to Local DB (Upsert)
        # We try to find the user by ID.
        user = User.find_by_id(account_id)

        if not user:
            # First time login for this user on AUPP
            # We create a local profile using the Bifrost ID
            user = User(
                _id=account_id,
                email=email,
                name=email.split('@')[0],  # Placeholder name
                role=role
            )
            user.save()
        else:
            # User exists, we might want to sync role if it changed in Bifrost
            if user.role != role:
                user.role = role
                user.save()

        # 4. Return Response
        # We rely on the Bifrost JWT for auth, so we just return user data here
        response = make_response(jsonify({
            'message': 'Session synced',
            'user': user.to_dict()
        }), 200)

        return response

    @staticmethod
    def logout():
        # AUPP is stateless regarding the token, but we clear cookies if any
        response = make_response(jsonify({"message": "Logged out successfully"}), 200)
        return response

    @staticmethod
    def check_auth():
        """
        Used by the frontend to verify if the stored token is still valid.
        Delegates to the Middleware (which calls Bifrost).
        """
        # If the request reaches here, it passed the middleware validation
        if hasattr(g, 'current_user'):
            return jsonify({"authenticated": True, "user": g.current_user}), 200

        return jsonify({"authenticated": False, "message": "Not authenticated"}), 401