from flask_cors import CORS

cors = CORS()


def init_cors(app):
    cors.init_app(app, resources={r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://your-production-frontend.com"
        ],
        "supports_credentials": True,
        "allow_headers": [
            "Content-Type",
            "Authorization",
            "Access-Control-Allow-Credentials"
        ]
    }})
