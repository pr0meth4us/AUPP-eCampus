from flask import Blueprint
from controllers.auth_controller import AuthController
from middleware.auth_middleware import login_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/sync-session', methods=['POST'])
def sync_session():
    """
    Called by frontend after redirected from Bifrost with a token.
    Syncs the user to local DB.
    """
    return AuthController.sync_session()

@auth_bp.route('/check', methods=['GET'])
@login_required
def check_auth():
    return AuthController.check_auth()

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return AuthController.logout()