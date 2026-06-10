from flask import Blueprint, request, jsonify, make_response
from app.services.bifrost_service import BifrostService

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # 1. Authenticate with Bifrost
    bifrost_resp = BifrostService.authenticate_user(email, password)

    if not bifrost_resp:
        return jsonify({"message": "Invalid credentials"}), 401

    token = bifrost_resp.get('jwt')
    user_info = bifrost_resp.get('user')

    # 2. Create Response and set HttpOnly Cookie
    response = make_response(jsonify({
        "status": "success",
        "user": user_info
    }))

    response.set_cookie(
        'auth_token',
        token,
        httponly=True,  # Critical: Prevents XSS access
        secure=True,  # Only send over HTTPS
        samesite='Lax',  # CSRF protection
        max_age=86400  # 24 hours
    )

    return response


@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.set_cookie('auth_token', '', expires=0)  # Clear the cookie
    return response