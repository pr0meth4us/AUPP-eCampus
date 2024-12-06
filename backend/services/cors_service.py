from flask_cors import CORS

def init_cors(app):
    CORS(app,
         resources={r"/*": {
             "origins": [
                 "https://ecampuseduaupp.vercel.app",
                 "http://localhost:3000"
             ],
             "supports_credentials": True,
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": [
                 "Content-Type",
                 "Authorization",
                 "X-Requested-With"
             ]
         }},
         supports_credentials=True
         )

    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = 'https://ecampuseduaupp.vercel.app'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Vary'] = 'Origin'
        response.headers['Content-Security-Policy'] = "upgrade-insecure-requests"

        return response