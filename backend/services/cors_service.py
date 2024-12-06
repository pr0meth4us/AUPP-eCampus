from flask_cors import CORS

# Initialize CORS
cors = CORS()

def init_cors(app):
    cors.init_app(app, resources={r"/*": {
        "origins": [
            "https://ecampusaupp-tau.vercel.app",  # Primary frontend domain
            "http://localhost:3000"  # Optional: for local development
        ],
        "supports_credentials": True,  # Allow cookies to be sent
        "allow_headers": [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }})

    @app.after_request
    def apply_cors(response):
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Origin'] = 'https://ecampusaupp-tau.vercel.app'
        response.headers['Vary'] = 'Origin'  # Important for proper CORS caching
        return response