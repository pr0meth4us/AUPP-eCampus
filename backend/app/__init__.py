from flask import Flask, jsonify
from app.services.mongo_service import init_mongo
from config import Config
import logging

def create_app():
    flask_app = Flask(__name__)
    flask_app.config.from_object(Config)

    # Initialize MongoDB connection
    init_mongo()

    # Initialize CORS for frontend communication
    from app.services.cors_service import init_cors
    init_cors(flask_app)

    # Register all application routes
    from app.routes import register_routes
    register_routes(flask_app)

    # SECURE ERROR HANDLER: Prevents leaking tracebacks to users
    @flask_app.errorhandler(500)
    def internal_error(error):
        logging.error(f"Server Error: {error}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

    @flask_app.route('/health')
    def health_check():
        return jsonify(status="healthy", service="aupp-backend"), 200

    return flask_app

# Create the app instance for Gunicorn/Production
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)