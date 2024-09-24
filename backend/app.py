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
    flask_app.register_blueprint(auth_bp, url_prefix='/auth')
    flask_app.register_blueprint(admin_bp, url_prefix='/admin')

    @flask_app.errorhandler(500)
    def internal_error(error):
        return jsonify(
            {'error': 'Internal Server Error', 'details': traceback.format_exc(), 'exception': str(error)}), 500

    return flask_app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)
