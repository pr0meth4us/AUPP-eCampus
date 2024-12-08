from flask_cors import CORS

def init_cors(app):
    cors = CORS(app, resources={r"/*": {
        "origins": [
            "https://ecampusauppedu.vercel.app",  # Frontend domain
            "http://localhost:3000",              # Local development
            "https://long-benedetta-aupp-f2be75c3.koyeb.app"  # Backend domain
        ],
        "supports_credentials": True,
        "allow_headers": [
            "Content-Type",
            "Authorization",
            "Access-Control-Allow-Credentials"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }})