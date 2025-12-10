import requests
import logging
from config import Config

logger = logging.getLogger(__name__)

class BifrostService:
    @staticmethod
    def validate_token(token):
        """
        Calls Bifrost's internal validation endpoint to verify a JWT.
        """
        try:
            url = f"{Config.BIFROST_INTERNAL_URL}/internal/validate-token"

            # Authenticate as the AUPP Service using Client ID/Secret
            auth = (Config.BIFROST_CLIENT_ID, Config.BIFROST_CLIENT_SECRET)

            payload = {"jwt": token}

            # Server-to-Server call
            response = requests.post(url, json=payload, auth=auth, timeout=5)

            if response.status_code == 200:
                # Returns: { "is_valid": True, "account_id": "...", "app_specific_role": "...", "email": "..." }
                return response.json()

            logger.warning(f"Bifrost validation failed: {response.status_code} - {response.text}")
            return None

        except Exception as e:
            logger.error(f"Error connecting to Bifrost: {e}")
            return None