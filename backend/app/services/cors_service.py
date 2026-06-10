from flask import Flask
from flask_cors import CORS


def init_cors(app: Flask):
    CORS(app,
         resources={r"/*": {
             "origins": [
                 "https://auppecampus.vercel.app",
                 "http://localhost:3000"
             ],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
             "allow_headers": [
                 "Content-Type",
                 "Authorization",
                 "Access-Control-Allow-Credentials",
                 "Access-Control-Allow-Origin",
                 "X-Requested-With"
             ],
             "expose_headers": ["Content-Type", "Authorization"]
         }},
         supports_credentials=True
         )

    @app.before_request
    def handle_preflight():
        from flask import request
        if request.method == "OPTIONS":
            from flask import make_response
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", request.headers.get('Origin', '*'))
            response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
            response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response
        return None