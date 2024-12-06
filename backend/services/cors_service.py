from flask_cors import CORS

cors = CORS()


def init_cors(app):
    cors.init_app(app, resources={r"/*": {
        "origins": "https://ecampusaupp-tau.vercel.app",
        "supports_credentials": True,
        "allow_headers": "*",
    }})
