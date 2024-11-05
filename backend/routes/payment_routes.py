from flask import Blueprint, request
from middleware.auth_middleware import token_required
from controllers.payment_controller import PaymentController
from services.mongo_service import db
import datetime
from bson import ObjectId

payment_routes = Blueprint('payment_routes', __name__)


@payment_routes.route('/api/payments/create', methods=['POST'])
@token_required
def create_payment():
    data = request.get_json()
    return PaymentController.create_payment(data)


@payment_routes.route('/api/payments/success', methods=['GET'])
@token_required
def payment_success():
    token = request.args.get('token')
    paymentId = request.args.get('paymentId')
    PayerID = request.args.get('PayerID')
    return PaymentController.payment_success(token, paymentId, PayerID)


@payment_routes.route('/api/payments/<payment_id>', methods=['GET'])
@token_required
def get_payment(payment_id):
    return PaymentController.get_payment(payment_id)


@payment_routes.route('/api/payments/course/<course_id>', methods=['GET'])
@token_required
def get_course_payment(course_id):
    return PaymentController.get_course_payment(course_id)


# models/payment_model.py (add these methods)
class Payment:
    # ... existing methods ...

    @staticmethod
    def find_payment_by_paypal_token(token):
        """
        Find payment record by PayPal token
        """
        return db.payments.find_one({
            'payment_details.token': token
        })

    @staticmethod
    def execute_payment_completion(payment_id, paypal_token, payer_id):
        result = db.payments.update_one(
            {
                '_id': ObjectId(payment_id),
                'payment_details.token': paypal_token
            },
            {
                '$set': {
                    'status': 'completed',
                    'payment_details.payer_id': payer_id,
                    'completed_at': datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
