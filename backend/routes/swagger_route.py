from flask_swagger_ui import get_swaggerui_blueprint

SWAGGER_URL = '/api/docs'

API_URL     = '/static/swagger.json'

swagger_bp = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "LMS API Documentation"
    }
)
