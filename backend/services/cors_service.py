from flask_cors import CORS

# Initialize CORS
cors = CORS()

def init_cors(app):
    cors.init_app(app, resources={r"/*": {
        "origins": "https://ecampusaupp-tau.vercel.app",  # Allow only this origin
        "supports_credentials": True,  # Allow cookies to be sent
        "allow_headers": "*",  # Allow all headers
    }})

    @app.after_request
    def apply_cors(response):
        response.headers['Access-Control-Allow-Credentials'] = 'true'  # Allow credentials (cookies)
        return response
