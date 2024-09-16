from flask import jsonify, Blueprint
from middleware.admin_middleware import require_admin

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/instructor-register', methods=['POST'])
@require_admin
def admin_only_route():
    return jsonify({'message': 'Welcome, Admin!'})
