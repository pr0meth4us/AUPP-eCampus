from .admin_routes import admin_bp
from .auth_routes import auth_bp
from .payment_routes import payment_bp
from .user_routes import user_bp
from .course_routes import course_bp
from .module_routes import module_bp
from .assignment_routes import assignment_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(payment_bp, url_prefix='/payment')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(course_bp, url_prefix='/course')
    app.register_blueprint(module_bp, url_prefix='/course/<course_id>/modules')
    app.register_blueprint(assignment_bp, url_prefix='/course/<course_id>/assignments')
