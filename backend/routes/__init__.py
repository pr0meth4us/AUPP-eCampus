from routes.course.assignment_routes import assignment_bp
from .admin_routes import admin_bp
from .student_routes import student_bp
from routes.course.course_routes import course_bp
from .auth_routes import auth_bp
from routes.course.submission_routes import submission_bp
from .payment_routes import payment_bp
from .user_routes import user_bp
from routes.course.module_route import module_routes


def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(student_bp, url_prefix='/students')
    app.register_blueprint(course_bp, url_prefix='/courses')
    app.register_blueprint(assignment_bp, url_prefix='/courses/<course_id>/assignments')
    app.register_blueprint(submission_bp, url_prefix='/assignments/<assignment_id>')
    app.register_blueprint(payment_bp, url_prefix='/payment')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(module_routes, url_prefix='/courses')
