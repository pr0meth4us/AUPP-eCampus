from flask_cors import CORS
from config import Config

cors = CORS()


def init_cors(app):
    allowed_origins = Config.CORS_ALLOWED_ORIGINS
    cors.init_app(app, resources={r"/*": {
        "origins": allowed_origins,
        "supports_credentials": True
    }})
    print(f"CORS allowed origins: {allowed_origins}")
