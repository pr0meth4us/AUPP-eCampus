import paypalrestsdk
import logging
import os
from config import Config

paypalrestsdk.configure({
    "mode": "sandbox",
    "client_id": os.getenv("PAYPAL_CLIENT_ID"),
    "client_secret": os.getenv("PAYPAL_CLIENT_SECRET")
})

logger = logging.getLogger(__name__)


def create_payment(amount, currency="USD"):
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "transactions": [{"amount": {"total": amount, "currency": currency}}],
        "redirect_urls": {
            "return_url": "http://localhost:5001/api/payments/success",
            "cancel_url": "http://localhost:5001/api/payments/cancel"
        }
    })
    if payment.create():
        logger.info("Payment created successfully")
        return payment
    else:
        logger.error(payment.error)
        return None


def execute_payment(payment_id, payer_id):
    payment = paypalrestsdk.Payment.find(payment_id)
    if payment.execute({"payer_id": payer_id}):
        logger.info("Payment executed successfully")
        return payment
    else:
        logger.error(payment.error)
        return None
