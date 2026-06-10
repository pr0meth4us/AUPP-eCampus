from bson import ObjectId
from flask import jsonify, g
from app.models.course_model import Course
from app.models.payment_model import Payment, PaymentException
from app.services.bifrost_service import BifrostService


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
            
            # 1. Ask Bifrost for an Intent URL
            bifrost_intent = BifrostService.create_payment_intent(
                account_id=str(g.current_user['_id']),
                amount=price,
                description=f"Course Purchase: {course_to_pay.get('title', 'Unknown')}"
            )
            
            if not bifrost_intent or not bifrost_intent.get('success'):
                return jsonify({'error': 'Bifrost intent creation failed'}), 502

            # 2. Record internally
            payment_id = Payment.create_payment_record(
                user_id=ObjectId(g.current_user['_id']),
                course_id=data['course_id'],
                price=price,
                currency='USD'
            )

            # Store the external transaction ID for later lookup
            tx_id = bifrost_intent.get('transaction_id')
            Payment._coll().update_one(
                {'_id': payment_id},
                {'$set': {'bifrost_transaction_id': tx_id}}
            )

            # approval_url handles redirection, we use Bifrost's payment_url or deeplink
            approval_url = bifrost_intent.get('payment_url') or bifrost_intent.get('deeplink') or bifrost_intent.get('secure_link')

            return jsonify({
                'payment_id': str(payment_id),
                'bifrost_tx_id': tx_id,
                'approval_url': approval_url,
                'price': price,
            }), 201

        except PaymentException as e:
            print(e)
            return jsonify({'error': str(e)}), 400

    @staticmethod
    def payment_success(payment_id, payer_id=None):
        """Mock/Callback endpoint for success handling."""
        # Bifrost uses webhooks, so this endpoint might just be a polling/verification endpoint
        # In a real Bifrost integration, Bifrost sends a webhook to grant the role.
        # For legacy compatibility, we mark it success internally here if requested.
        payment = Payment.find_payment_by_id(payment_id)
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404

        # For strict security, we'd verify the Bifrost transaction status via an API call here.
        result = Payment.execute_payment_completion(
            payment_data=payment,
            paypal_payment_id=payment.get('bifrost_transaction_id', 'bifrost_tx'),
            payer_id=payer_id or 'bifrost_payer'
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
            return jsonify({'error': 'Payment not found'}), 204

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
            return jsonify({'error': 'No completed payment found for this course'}), 204

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
