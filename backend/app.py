from flask import Flask, jsonify
from services.mongo_service import init_mongo
from config import Config
import traceback

def create_app():
    flask_app = Flask(__name__)
    flask_app.config.from_object(Config)
    init_mongo(flask_app)
    from services.cors_service import init_cors
    init_cors(flask_app)

    from routes.auth_routes import auth_bp
    from routes.admin_routes import admin_bp
    from routes.course_routes import course_bp
    flask_app.register_blueprint(auth_bp, url_prefix='/auth')
    flask_app.register_blueprint(admin_bp, url_prefix='/admin')
    flask_app.register_blueprint(course_bp, url_prefix='/courses')

    @flask_app.errorhandler(500)
    def internal_error(error):
        return jsonify(
            {'error': 'Internal Server Error', 'details': traceback.format_exc(), 'exception': str(error)}
        ), 500

    @flask_app.route('/health')
    def health_check():
        return jsonify(status="healthy"), 200

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

    return flask_app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)