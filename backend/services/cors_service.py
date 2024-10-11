from flask_cors import CORS
from config import Config

cors = CORS()


def init_cors(app):
    cors.init_app(app, resources={r"/*": {
        "origins": "*",
        "supports_credentials": True
    }})
    print("CORS allowed origins: All (*)")

