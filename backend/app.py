from flask import Flask, jsonify, requests
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

    @flask_app.route('/login', methods=['POST'])  # configure captcha in login
    def login():
        recaptcha_responses = requests.json.get('g-recaptcha-response')
        data = {
            'secret': flask_app.config['RECAPTCHA_SECRET_KEY'],
            'response': recaptcha_responses
        }
        r = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
        result = r.json()

        if result['success']:
            return jsonify({'message': 'login successful'}), 200  # pass
        else:
            return jsonify({'message': 'reCAPTCHA verification faild'}), 400  # fail

    @flask_app.errorhandler(500)
    def internal_error(error):
        return jsonify(
            {'error': 'Internal Server Error', 'details': traceback.format_exc(), 'exception': str(error)}), 500

    return flask_app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)
