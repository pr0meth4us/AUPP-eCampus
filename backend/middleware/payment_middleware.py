from functools import wraps
from flask import jsonify, g
from models.payment_model import Payment
from models.course.course_model import Course
from .auth_middleware import login_required


def payment_required(f):
    @wraps(f)
    @login_required
    def wrapper(*args, **kwargs):
        user_id = g.current_user["_id"]
        course_id = kwargs.get("course_id")
        course = Course.find_by_id(course_id)

        if course["price"] == "0" or course["price"] is None:
            return f(*args, **kwargs)

        payment = Payment.get_user_course_payment(user_id, course_id)
        print(payment, "asfsfa")
        if not payment or payment["status"] != "completed":
            return jsonify({"message": "Payment required to access this content"}), 403

        return f(*args, **kwargs)

    return wrapper
