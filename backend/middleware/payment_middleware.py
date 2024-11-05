from flask import jsonify, g
from models.payment_model import Payment


def payment_required(f):
    def decorated_function(*args, **kwargs):
        user_id = g.user_id
        course_id = kwargs.get("course_id")

        payment = Payment.get_user_course_payment(course_id, user_id)
        if not payment or payment["status"] != "completed":
            return jsonify({"message": "Payment required to access this content"}), 403

        return f(*args, **kwargs)

    return decorated_function
