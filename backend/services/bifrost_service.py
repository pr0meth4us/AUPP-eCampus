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

            # Using Basic Auth with Client ID/Secret as defined in Bifrost's internal_bp
            auth = (Config.BIFROST_CLIENT_ID, Config.BIFROST_CLIENT_SECRET)

            payload = {"jwt": token}

            response = requests.post(url, json=payload, auth=auth, timeout=5)

            if response.status_code == 200:
                return response.json()  # Returns { is_valid, account_id, app_specific_role, email }

            logger.warning(f"Bifrost validation failed: {response.status_code} - {response.text}")
            return None

        except Exception as e:
            logger.error(f"Error connecting to Bifrost: {e}")
            return None