from flask_cors import CORS

cors = CORS()


def init_cors(app):
    allowed_origins = app.config['CORS_ALLOWED_ORIGINS']
    cors.init_app(app, resources={r"/*": {"origins": allowed_origins}})
    print(allowed_origins)
