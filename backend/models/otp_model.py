import hashlib
from services.redis_service import redis_client
from random import randint


class OTP:
    @staticmethod
    def hash_otp(otp):
        return hashlib.sha256(str(otp).encode()).hexdigest()

    @staticmethod
    def create_otp(email):
        otp = randint(10000, 99999)
        hashed_otp = OTP.hash_otp(otp)
        expiration_time = 300
        redis_client.setex(f'otp:{email}', expiration_time, hashed_otp)
        return otp

    @staticmethod
    def verify_otp(email, received_otp):
        hashed_received_otp = OTP.hash_otp(received_otp)
        stored_otp = redis_client.get(f'otp:{email}')

        if stored_otp and stored_otp == hashed_received_otp:
            redis_client.delete(f'otp:{email}')
            return True

        return False
