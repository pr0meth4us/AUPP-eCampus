from flask_cors import CORS

cors = CORS()


def init_cors(app):
    cors.init_app(app, resources={r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://your-production-frontend.com",
            "http://127.0.0.1:3000",
            "http://192.168.100.58:3000",
        ],
        "supports_credentials": True,
        "allow_headers": [
            "Content-Type",
            "Authorization",
            "Access-Control-Allow-Credentials"
        ]
    }})
