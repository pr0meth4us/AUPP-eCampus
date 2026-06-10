import requests
from functools import wraps
from flask import request, jsonify
from config import Config

def verify_turnstile(token):
    secret_key = Config.TURNSTILE_SECRET_KEY
    if not secret_key:
        return False
        
    try:
        response = requests.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            data={
                'secret': secret_key,
                'response': token
            }
        )
        result = response.json()
        return result.get('success', False)
    except Exception as e:
        print(f"Turnstile verification error: {e}")
        return False

def require_turnstile(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not Config.TURNSTILE_SECRET_KEY:
            # If secret key is not configured, bypass for local dev, or fail strict.
            # We bypass here to prevent breaking dev environments that haven't set it yet.
            print("WARNING: TURNSTILE_SECRET_KEY is not set. Bypassing captcha.")
            return f(*args, **kwargs)

        # Allow skipping captcha for non-browser requests (like Postman or tests) if needed,
        # but usually we want to enforce it. For this implementation, we enforce it.
        turnstile_token = request.json.get('turnstile_token')
        if not turnstile_token:
            return jsonify({'message': 'Cloudflare Turnstile token is required'}), 400

        if not verify_turnstile(turnstile_token):
            return jsonify({'message': 'Cloudflare Turnstile verification failed'}), 400

        return f(*args, **kwargs)
    return decorated_function
