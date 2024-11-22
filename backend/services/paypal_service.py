import paypalrestsdk
import logging
import os
from datetime import datetime, timezone
from config import Config

paypalrestsdk.configure({
    "mode": "sandbox",
    "client_id": os.getenv("PAYPAL_CLIENT_ID"),
    "client_secret": os.getenv("PAYPAL_CLIENT_SECRET")
})

logger = logging.getLogger(__name__)


class PayPalFees:

    DOMESTIC_RATE_STANDARD = 0.0349  # 3.49%
    DOMESTIC_RATE_QR_CODE = 0.0229  # 2.29%
    DOMESTIC_FIXED_FEE = 0.49  # USD

    INTERNATIONAL_RATE_ADDITIONAL = 0.015  # Additional 1.5%

    FIXED_FEES = {
        "USD": 0.49,
        "EUR": 0.39,
        "GBP": 0.39,
        "JPY": 49.00,
        "AUD": 0.59,
    }

    @staticmethod
    def calculate_fees(price, currency="USD", transaction_type="domestic"):
        try:
            price = float(price)
        except ValueError:
            raise ValueError("Price must be a valid number")
        fixed_fee = PayPalFees.FIXED_FEES.get(currency, PayPalFees.DOMESTIC_FIXED_FEE)

        if transaction_type == "domestic":
            percentage_rate = PayPalFees.DOMESTIC_RATE_STANDARD
        elif transaction_type == "international":
            percentage_rate = PayPalFees.DOMESTIC_RATE_STANDARD + PayPalFees.INTERNATIONAL_RATE_ADDITIONAL
        else:
            raise ValueError("Unsupported transaction type")

        percentage_fee = price * percentage_rate
        total_fee = round(percentage_fee + fixed_fee, 2)
        return total_fee


class PaymentService:
    @staticmethod
    def create_payment(price, currency="USD", transaction_type="domestic", description="Purchase"):
        fees = PayPalFees.calculate_fees(price, currency, transaction_type)
        print(type(fees), type(price))
        total = round(float(price) + fees, 2)

        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {"payment_method": "paypal"},
            "transactions": [{
                "amount": {
                    "total": total,
                    "currency": currency,
                },
                "description": description
            }],
            "redirect_urls": {
                "return_url": f"{Config.CLIENT_URL}/payment/success",
                "cancel_url": f"{Config.CLIENT_URL}/payment/cancel"
            }
        })

        payment.create()
        return payment

    @staticmethod
    def execute_payment(payment_id, payer_id):
        payment = paypalrestsdk.Payment.find(payment_id)
        return payment


    @staticmethod
    def generate_receipt(payment, fees, total, currency):
        receipt = {
            "Receipt ID": payment.id,
            "Date": datetime.now(timezone.utc).isoformat(),
            "Transaction Type": "PayPal Checkout",
            "Currency": currency,
            "Subtotal": payment.transactions[0]["amount"]["details"]["subtotal"],
            "Fees": f"{fees:.2f} {currency}",
            "Total Amount": f"{total:.2f} {currency}",
            "Payer Info": {
                "Payer ID": payment.payer.payer_info.payer_id,
                "Email": payment.payer.payer_info.email,
                "First Name": payment.payer.payer_info.first_name,
                "Last Name": payment.payer.payer_info.last_name,
            },
            "Approval URL": payment.links[1].href
        }
        logger.info(f"Generated receipt: {receipt}")
        return receipt
