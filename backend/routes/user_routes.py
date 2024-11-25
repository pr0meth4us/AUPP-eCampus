from flask import Blueprint
from models.user_model import User

user_bp = Blueprint('user', __name__)


@user_bp.route('/<id>', methods=['GET'])
def get_name(id):
    return User.get_name_by_id(id)
