from bson import ObjectId
from flask import jsonify, g
from models.course.course_model import Course
from models.payment_model import Payment, PaymentException


class PaymentController:
    @staticmethod
    def create_payment(data):
        try:
            if 'course_id' not in data:
                return jsonify({'error': 'Missing course_id'}), 400

            course_to_pay = Course.find_by_id(data['course_id'])
            if not course_to_pay:
                return jsonify({'error': 'Course not found'}), 404

            price = course_to_pay.get('price', 0)
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
            return jsonify({'error': str(e)}), 400

    @staticmethod
    def payment_success(paypal_payment_id, payer_id):
        if not paypal_payment_id or not payer_id:
            return jsonify({'error': 'Missing required parameters'}), 400

        payment = Payment.find_payment_by_paypal_id(paypal_payment_id)
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404

        result = Payment.execute_payment_completion(
            payment_data=payment,
            paypal_payment_id=paypal_payment_id,
            payer_id=payer_id
        )

        payment['_id'] = str(result)
        payment['user_id'] = str(payment['user_id'])
        payment['course_id'] = str(payment['course_id'])

        receipt = Payment.generate_receipt(payment)

        return jsonify({
            'message': 'Payment completed successfully',
            'payment_id': payment['_id'],
            'receipt': receipt
        }), 200

    @staticmethod
    def get_payment(payment_id):
        payment = Payment.find_payment_by_id(payment_id)
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404

        if str(payment['user_id']) != str(g.current_user['_id']):
            return jsonify({'error': 'Unauthorized access'}), 403

        payment['_id'] = str(payment.get('_id'))
        payment['user_id'] = str(payment['user_id'])
        payment['course_id'] = str(payment['course_id'])

        return jsonify({
            'payment_id': payment['_id'],
            'price': payment['price'],
            'currency': payment['currency'],
            'status': payment['status'],
            'created_at': payment['created_at'],
            'payment_details': payment.get('payment_details', {})
        }), 200

    @staticmethod
    def get_course_payment(course_id):
        user_id = g.current_user['_id']
        payment = Payment.get_user_course_payment(user_id, course_id)
        if not payment:
            return jsonify({'error': 'No completed payment found for this course'}), 404

        payment['_id'] = str(payment['_id'])
        payment['user_id'] = str(payment['user_id'])
        payment['course_id'] = str(payment['course_id'])

        return jsonify({
            'payment_id': payment['_id'],
            'price': payment['price'],
            'currency': payment['currency'],
            'status': payment['status'],
            'created_at': payment['created_at']
        }), 200
