from random import randint
from services.mongo_service import db
import time


class OTP:
    @staticmethod
    def create_otp(email):
        otp = randint(10000, 99999)
        expiration_time = time.time() + 300
        db.otps.insert_one({'email': email, 'otp': otp, 'expires_at': expiration_time})
        return otp

    @staticmethod
    def verify_otp(email, received_otp):
        otp_entry = db.otps.find_one({'email': email, 'otp': received_otp})
        if otp_entry and time.time() < otp_entry['expires_at']:
            db.otps.delete_one({'_id': otp_entry['_id']})
            return True
        return False
