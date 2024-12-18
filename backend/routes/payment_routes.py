from flask import Blueprint, request

from controllers.payment_controller import PaymentController
from middleware.auth_middleware import login_required

payment_bp = Blueprint('payment', __name__)


@payment_bp.route('/create', methods=['POST'])
@login_required
def create_payment():
    data = request.get_json()
    print(data)
    return PaymentController.create_payment(data)


@payment_bp.route('/success', methods=['GET'])
@login_required
def payment_success():
    token = request.args.get('token')
    payment_id = request.args.get('paymentId')
    payer_id = request.args.get('PayerID')
    return PaymentController.payment_success(payment_id, payer_id)


@payment_bp.route('/<payment_id>', methods=['GET'])
@login_required
def get_payment(payment_id):
    return PaymentController.get_payment(payment_id)


@payment_bp.route('/<course_id>', methods=['GET'])
@login_required
def get_course_payment(course_id):
    return PaymentController.get_course_payment(course_id)
