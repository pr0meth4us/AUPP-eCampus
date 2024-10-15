from flask import jsonify, request, g
from functools import wraps

def own_profile_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = request.view_args.get('user_id')  # Assuming you have user_id in the route
        current_user_id = g.current_user_id  # Set this when the user logs in

        if str(current_user_id) != str(user_id):
            return jsonify({"message": "You can only edit your own profile."}), 403

        return f(*args, **kwargs)
    return decorated_function