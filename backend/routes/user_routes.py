from flask import Blueprint
from models.user_model import User

user_bp = Blueprint('user', __name__)


@user_bp.route('/<user_id>', methods=['GET'])
def get_name(user_id):
    return User.get_name_by_id(user_id)


@user_bp.route('/<user_id>/profile', methods=['GET'])
def get_profile(user_id):
    return User.get_profile(user_id)
