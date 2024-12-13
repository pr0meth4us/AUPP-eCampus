from flask import Flask, request
from flask_cors import CORS, cross_origin

def init_cors(app):
    cors = CORS(app, resources={
        r"/*": {
            "origins": [
                "https://ecampusauppedu.vercel.app",
                "https://long-benedetta-aupp-f2be75c3.koyeb.app"
            ],
            "supports_credentials": True,
            "allow_headers": [
                "Content-Type",
                "Authorization",
                "Access-Control-Allow-Credentials"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    })

    @app.before_request
    def handle_preflight():
        if request.method == 'OPTIONS':
            # Directly handle preflight requests
            response = app.make_default_options_response()
            response.headers['Access-Control-Allow-Origin'] = 'https://ecampusauppedu.vercel.app'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            return response

    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = 'https://ecampusauppedu.vercel.app'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response