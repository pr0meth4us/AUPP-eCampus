from flask import Flask, jsonify
from services.mongo_service import init_mongo
from config import Config
import traceback
import logging

def create_app():
    flask_app = Flask(__name__)

    # Load configuration from Config class
    flask_app.config.from_object(Config)
    
    # Initialize MongoDB
    init_mongo(flask_app)

    # Initialize CORS
    from services.cors_service import init_cors
    init_cors(flask_app)

    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.admin_routes import admin_bp
    flask_app.register_blueprint(auth_bp, url_prefix='/auth')
    flask_app.register_blueprint(admin_bp, url_prefix='/admin')
    
    # Set up logging
    logging.basicConfig(level=logging.INFO)

    # Error handler for 500 internal server errors
    @flask_app.errorhandler(500)
    def internal_error(error):
        logging.error(f'Internal Server Error: {error}, Traceback: {traceback.format_exc()}')
        return jsonify(
            {'error': 'Internal Server Error', 'details': traceback.format_exc(), 'exception': str(error)}), 500

    return flask_app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)