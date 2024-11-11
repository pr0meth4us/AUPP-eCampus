import paypalrestsdk
import logging
from config import Config

paypalrestsdk.configure({
    "mode": "sandbox",
    "client_id": Config.PAYPAL_CLIENT_ID,
    "client_secret": Config.PAYPAL_CLIENT_SECRET
})

logger = logging.getLogger(__name__)


def create_payment(amount, currency="USD"):
    paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "transactions": [{"amount": {"total": amount, "currency": currency}}],
        "redirect_urls": {
            "return_url": f"{Config.CLIENT_URL}/api/payments/success",
            "cancel_url": f"{Config.CLIENT_URL}/api/payments/cancel"
        }
    })


def execute_payment(payment_id):
    paypalrestsdk.Payment.find(payment_id)
