from bson import ObjectId
from flask import jsonify, g
from models.course.course_model import Course
from models.payment_model import Payment, PaymentException


class PaymentController:

    @staticmethod
    def create_payment(data):
        try:
            course_to_pay = Course.find_by_id(data['course_id'])
            price = course_to_pay.get('price')
            payment_id = Payment.create_payment_record(
                user_id=ObjectId(g.current_user['_id']),
                course_id=data['course_id'],
                price=price,
                currency='USD'
            )

            payment = Payment.find_payment_by_id(payment_id)
            return jsonify({
                'payment_id': str(payment_id),
                'approval_url': payment['approval_url'],
                'price': price,
            }), 201
        except PaymentException as e:
            return jsonify({"error": str(e)}), 409

    @staticmethod
    def payment_success(paypal_payment_id, payer_id):
        if not paypal_payment_id or not payer_id:
            return jsonify({'error': 'Missing required parameters'}), 400

        payment = Payment.find_payment_by_paypal_id(paypal_payment_id)
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404

        success = Payment.execute_payment_completion(
            payment_data=payment,
            paypal_payment_id=paypal_payment_id,
            payer_id=payer_id
        )

        if success:
            receipt = Payment.generate_receipt(
                payment_data=payment
            )

            return jsonify({
                'message': 'Payment completed successfully',
                'payment_id': str(payment['_id']),
                'receipt': receipt
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
            'price': payment['price'],
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
            'price': payment['price'],
            'currency': payment['currency'],
            'status': payment['status'],
            'created_at': payment['created_at'].isoformat()
        }), 200
