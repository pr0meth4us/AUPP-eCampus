from flask import Flask, jsonify, make_response
from services.mongo_service import init_mongo
from config import Config
import traceback


def create_app():
    flask_app = Flask(__name__)

    flask_app.config.from_object(Config)
    init_mongo()
    from services.cors_service import init_cors
    init_cors(flask_app)

    from routes import register_routes
    register_routes(flask_app)

    @flask_app.errorhandler(500)
    def internal_error(error):
        return jsonify(
            {'error': 'Internal Server Error', 'details': traceback.format_exc(), 'exception': str(error)}
        ), 500

    @flask_app.route('/health')
    def health_check():
        return jsonify(status="healthy"), 200

    @flask_app.route('/set_cookie')
    def set_cookie():
        resp = make_response("Setting cookie")
        resp.set_cookie(
            '__vercel_live_token',
            value='your_token',
            samesite='None',  # Allows cross-site cookies
            secure=True,      # Cookie only sent over HTTPS
            httponly=True     # Optional, for additional security
        )
        return resp


    @flask_app.after_request
    def add_csp_headers(response):
        response.headers['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' https://www.google.com https://www.gstatic.com; "
            "frame-src 'self' https://www.google.com; "
            "style-src 'self' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com;"
        )
        return response

    @flask_app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = 'https://ecampusauppedu.vercel.app/'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

    return flask_app



app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)