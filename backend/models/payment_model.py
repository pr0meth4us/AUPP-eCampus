from datetime import datetime, timezone
from bson import ObjectId
from services.paypal_service import PaymentService
import json
import logging
from services.redis_service import redis_client
from services.mongo_service import db

logger = logging.getLogger(__name__)


class PaymentException(Exception):
    """Custom exception for payment-related errors"""
    pass


class Payment:
    PAYMENT_KEY_PREFIX = "payment:"
    PAYMENT_EXPIRY = 3600

    @staticmethod
    def create_payment_record(user_id, course_id, price, currency,
                              status='pending'):
        already_paid = Payment.get_user_course_payment(user_id, course_id)
        if already_paid:
            raise PaymentException("Payment already paid")

        if not price:
            return None

        paypal_payment = PaymentService.create_payment(course_id, price, currency)

        payment_id = str(ObjectId())

        payment_data = {
            'user_id': str(ObjectId(user_id)) if isinstance(user_id, str) else str(user_id),
            'course_id': str(ObjectId(course_id)),
            'price': price,
            'currency': currency,
            'status': status,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat(),
            'payment_method': 'paypal',
            'paypal_payment_id': paypal_payment.id,
            'approval_url': next(link.href for link in paypal_payment.links if link.rel == 'approval_url'),
            'payment_state': paypal_payment.state
        }

        payment_key = f"{Payment.PAYMENT_KEY_PREFIX}{payment_id}"
        success = redis_client.setex(
            payment_key,
            Payment.PAYMENT_EXPIRY,
            json.dumps(payment_data)
        )

        if not success:
            raise PaymentException("Failed to store payment in Redis")

        logger.info(f"Payment record created: {payment_id}")
        return payment_id

    @staticmethod
    def update_payment_status(payment_id, status, payment_details):
        try:
            payment_key = f"{Payment.PAYMENT_KEY_PREFIX}{payment_id}"

            payment_data_str = redis_client.get(payment_key)
            if not payment_data_str:
                raise PaymentException(f"Payment record {payment_id} not found")

            payment_data = json.loads(payment_data_str)

            payment_data['status'] = status
            payment_data['updated_at'] = datetime.now(timezone.utc).isoformat()

            if payment_details:
                payment_data.update(payment_details)

            success = redis_client.setex(
                payment_key,
                Payment.PAYMENT_EXPIRY,
                json.dumps(payment_data)
            )

            if not success:
                raise PaymentException("Failed to update payment in Redis")

            logger.info(f"Payment {payment_id} status updated to {status}")
            return True

        except Exception as e:
            logger.error(f"Error updating payment status: {str(e)}")
            raise PaymentException(f"Failed to update payment status: {str(e)}")

    @staticmethod
    def find_payment_by_id(payment_id):
        payment_key = f"{Payment.PAYMENT_KEY_PREFIX}{payment_id}"
        payment_data_str = redis_client.get(payment_key)

        if payment_data_str:
            return json.loads(payment_data_str)
        return None

    @staticmethod
    def find_payment_by_paypal_id(paypal_payment_id):
        cursor = 0
        while True:
            cursor, keys = redis_client.scan(
                cursor,
                match=f"{Payment.PAYMENT_KEY_PREFIX}*",
                count=100
            )

            for key in keys:
                payment_data_str = redis_client.get(key)
                if payment_data_str:
                    payment_data = json.loads(payment_data_str)
                    if payment_data.get('paypal_payment_id') == paypal_payment_id:
                        return payment_data

            if cursor == 0:
                break

        return None

    @staticmethod
    def clear_expired_payment(payment_id):
        payment_key = f"{Payment.PAYMENT_KEY_PREFIX}{payment_id}"
        return redis_client.delete(payment_key) > 0

    @staticmethod
    def execute_payment_completion(payment_data, paypal_payment_id, payer_id):
        payment_result = PaymentService.execute_payment(paypal_payment_id, payer_id)
        if not payment_result:
            raise PaymentException("Failed to execute PayPal payment")
        payment_data.update({
            'user_id': ObjectId(payment_data['user_id']),
            'course_id': ObjectId(payment_data['course_id']),
            'status': 'completed',
            'payer_id': payer_id,
            'payment_state': payment_result.state,
            'completed_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc)
        })

        result = db.payments.insert_one(payment_data).inserted_id
        Payment.clear_expired_payment(paypal_payment_id)

        return result

    @staticmethod
    def get_user_course_payment(user_id, course_id):
        try:
            query = {
                'user_id': ObjectId(user_id),
                'course_id': ObjectId(course_id),
                'status': 'completed'
            }
            print("Querying with:", query)

            payment = db.payments.find_one(query)
            print("Query Result:", payment)

            return payment
        except Exception as e:
            print("Error querying payment:", str(e))
            return None

    @staticmethod
    def generate_receipt(payment_data):
        receipt = {
            "Receipt ID": payment_data.get("_id", "N/A"),
            "Date": payment_data.get("updated_at", datetime.now(timezone.utc).isoformat()),
            "Price": payment_data["price"],
            "Currency": payment_data["currency"],
            "Status": payment_data["status"],
            "Approval URL": payment_data.get("approval_url", "N/A"),
            "Payer ID": payment_data.get("payer_id", "N/A"),
        }
        return receipt
