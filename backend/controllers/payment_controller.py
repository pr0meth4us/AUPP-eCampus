from bson import ObjectId
from flask import jsonify, g
from models.course_model import Course
from models.payment_model import Payment


class PaymentController:

    @staticmethod
    def create_payment(data):
        course_to_pay = Course.find_by_id(data['course_id'])
        amount = course_to_pay.get('amount')
        payment_id = Payment.create_payment_record(
            user_id=ObjectId(g.current_user['_id']),
            course_id=data['course_id'],
            amount=amount,
            currency='USD'
        )

        payment = Payment.find_payment_by_id(payment_id)
        return jsonify({
            'payment_id': str(payment_id),
            'approval_url': payment['approval_url'],
            'amount': amount,
        }), 201

    @staticmethod
    def payment_success(token, paypal_payment_id, payer_id):
        if not paypal_payment_id or not payer_id:
            return jsonify({'error': 'Missing required parameters'}), 400

        payment = Payment.find_payment_by_paypal_id(paypal_payment_id)
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404
        print(payment, "paypal id find")

        success = Payment.execute_payment_completion(
            payment_data=payment,
            paypal_payment_id=paypal_payment_id,
            payer_id=payer_id
        )

        if success:
            return jsonify({
                'message': 'Payment completed successfully',
                'payment_id': str(payment['_id'])
            }), 200
        return jsonify({'error': 'Payment execution failed'}), 400


    @staticmethod
    def get_payment(payment_id):
        payment = Payment.find_payment_by_id(payment_id)
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404

        if str(payment['user_id']) != g.current_user['_id']:
            return jsonify({'error': 'Unauthorized access'}), 403

        return jsonify({
            'payment_id': str(payment['_id']),
            'amount': payment['amount'],
            'currency': payment['currency'],
            'status': payment['status'],
            'created_at': payment['created_at'].isoformat(),
            'payment_details': payment['payment_details']
        }), 200

    @staticmethod
    def get_course_payment(course_id):
        user_id = g.current_user['_id']
        payment = Payment.get_user_course_payment(user_id, course_id)
        if not payment:
            return jsonify({'error': 'No completed payment found for this course'}), 404

        return jsonify({
            'payment_id': str(payment['_id']),
            'amount': payment['amount'],
            'currency': payment['currency'],
            'status': payment['status'],
            'created_at': payment['created_at'].isoformat()
        }), 200
