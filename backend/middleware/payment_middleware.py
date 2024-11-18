from functools import wraps
from flask import jsonify, g
from models.payment_model import Payment
from models.course_model import Course
from .auth_middleware import token_required


def payment_required(f):
    @wraps(f)
    @token_required
    def wrapper(*args, **kwargs):
        user_id = g.current_user["_id"]
        course_id = kwargs.get("course_id")
        course = Course.find_by_id(course_id)
        print(course_id, user_id)

        if course["amount"] == "0" or course["amount"] is None:
            return f(*args, **kwargs)

        payment = Payment.get_user_course_payment( user_id, course_id)
        print(payment)
        if not payment or payment["status"] != "completed":
            return jsonify({"message": "Payment required to access this content"}), 403

        return f(*args, **kwargs)

    return wrapper
