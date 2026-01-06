import requests
from flask import current_app

class BifrostService:
    @staticmethod
    def _get_base_url():
        return current_app.config['BIFROST_URL']

    @staticmethod
    def authenticate_user(email, password):
        """Calls Bifrost Headless API to verify credentials."""
        url = f"{BifrostService._get_base_url()}/auth/api/login"
        payload = {
            "email": email,
            "password": password,
            "client_id": current_app.config['BIFROST_CLIENT_ID'],
            "client_secret": current_app.config['BIFROST_CLIENT_SECRET']
        }
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                return response.json() # Should return { "jwt": "...", "user": {...} }
            return None
        except Exception:
            return None

    @staticmethod
    def validate_token(token):
        """Asks Bifrost if the provided JWT is still valid."""
        url = f"{BifrostService._get_base_url()}/auth/api/validate-token"
        headers = {"Authorization": f"Bearer {token}"}
        try:
            response = requests.get(url, headers=headers)
            return response.json() if response.status_code == 200 else None
        except Exception:
            return None