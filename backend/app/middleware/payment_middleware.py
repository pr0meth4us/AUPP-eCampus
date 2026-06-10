from functools import wraps
from flask import jsonify, g, request
from app.models.payment_model import Payment
from app.models.course_model import Course
from app.utils.token_utils import get_token_from_request, decode_token


def payment_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = get_token_from_request()
        try:
            payload = decode_token(token)
            g.current_user = payload
            request.user = payload
            user_id = g.current_user["_id"]
        except Exception:
            return f(*args, **kwargs, has_access=False)

        course_id = kwargs.get("course_id")

        course = Course.find_by_id(course_id)
        if not course:
            return jsonify({"message": "Course not found"}), 404

        if course.get("price") == "0" or not course.get("price"):
            return f(*args, **kwargs, has_access=True)

        payment = Payment.get_user_course_payment(user_id, course_id)
        if payment and payment.get("status") == "completed":
            return f(*args, **kwargs, has_access=True)

        return f(*args, **kwargs, has_access=False)

    return wrapper
