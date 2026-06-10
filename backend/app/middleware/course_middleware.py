from functools import wraps
import logging
from functools import wraps

from bson import ObjectId
from flask import g, jsonify, request

from app.models.course_model import Course

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def require_course_access(access_level='preview'):
    """
    Simplified middleware - just check access and return 401/403 if denied
    access_level options: 'preview', 'enrolled', 'instructor', 'owner'
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                course_id = kwargs.get('course_id')
                if not course_id:
                    return jsonify({'error': 'Course ID required'}), 400
                try:
                    ObjectId(course_id)
                except Exception as e:
                    return jsonify({'error': 'Invalid course ID format'}), 400

                course = Course.find_instance_by_id(course_id)

                if not course:
                    return jsonify({'error': 'Course not found'}), 404

                if access_level == 'preview':
                    return f(*args, **kwargs)

                if not hasattr(g, 'current_user') or not g.current_user:
                    return jsonify({'error': 'Authentication required'}), 401

                try:
                    user_id = str(g.current_user['_id'])
                    user_role = g.current_user.get('role')
                except (KeyError, TypeError) as e:
                    return jsonify({'error': 'Invalid user session'}), 401

                # Admin always has access
                if user_role == 'admin':
                    return f(*args, **kwargs)

                try:
                    enrolled_students = [str(s) for s in getattr(course, 'enrolled_students', [])]
                    instructor_id = str(getattr(course, 'instructor_id', ''))
                    uploader_id = str(getattr(course, 'uploader_id', ''))

                except Exception as e:
                    return jsonify({'error': 'Error checking course access'}), 500

                # Check specific access levels
                if access_level == 'enrolled':
                    if (user_id in enrolled_students or
                            instructor_id == user_id or
                            uploader_id == user_id):
                        return f(*args, **kwargs)
                    else:
                        return jsonify({'error': 'Course enrollment required'}), 403

                elif access_level == 'instructor':
                    if instructor_id == user_id or uploader_id == user_id:
                        return f(*args, **kwargs)
                    else:
                        return jsonify({'error': 'Instructor access required'}), 403
                return jsonify({'error': 'Access denied'}), 403

            except Exception as e:
                logger.exception(f"Unexpected error in require_course_access: {str(e)}")
                return jsonify({'error': 'Internal server error'}), 500

        return decorated_function
    return decorator


def require_module_access(f):
    """Check if user has access to module within course"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        course_id = kwargs.get('course_id')
        module_id = kwargs.get('module_id')

        if not course_id or not module_id:
            return jsonify({'error': 'Course ID and Module ID required'}), 400

        # Check course access first
        course = Course.find_instance_by_id(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404

        # Check if module belongs to course
        if module_id not in [str(m) for m in course.modules]:
            return jsonify({'error': 'Module not found in this course'}), 404

        # Check user access (enrolled or instructor)
        if not g.current_user:
            return jsonify({'error': 'Authentication required'}), 401

        user_id = str(g.current_user['_id'])
        user_role = g.current_user.get('role')

        if (user_role == 'admin' or
                str(course.instructor_id) == user_id or
                str(course.uploader_id) == user_id or
                user_id in [str(s) for s in course.enrolled_students]):
            return f(*args, **kwargs)

        return jsonify({'error': 'Access denied'}), 403

    return decorated_function


def require_assignment_access(access_type='view'):
    """
    Check assignment access
    access_type options: 'view', 'submit', 'grade'
    """

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            course_id = kwargs.get('course_id')
            assignment_id = kwargs.get('assignment_id')

            if not course_id or not assignment_id:
                return jsonify({'error': 'Course ID and Assignment ID required'}), 400

            # Check course and assignment exist
            course = Course.find_instance_by_id(course_id)
            if not course:
                return jsonify({'error': 'Course not found'}), 404

            if assignment_id not in [str(a) for a in course.assignments]:
                return jsonify({'error': 'Assignment not found in this course'}), 404

            if not g.current_user:
                return jsonify({'error': 'Authentication required'}), 401

            user_id = str(g.current_user['_id'])
            user_role = g.current_user.get('role')

            # Admin always has access
            if user_role == 'admin':
                return f(*args, **kwargs)

            if access_type == 'view':
                # Enrolled students and instructors can view
                if (str(course.instructor_id) == user_id or
                        str(course.uploader_id) == user_id or
                        user_id in [str(s) for s in course.enrolled_students]):
                    return f(*args, **kwargs)

            elif access_type == 'submit':
                # Only enrolled students can submit
                if user_id in [str(s) for s in course.enrolled_students]:
                    return f(*args, **kwargs)
                return jsonify({'error': 'Must be enrolled to submit assignments'}), 403

            elif access_type == 'grade':
                # Only instructors can grade
                if (str(course.instructor_id) == user_id or
                        str(course.uploader_id) == user_id):
                    return f(*args, **kwargs)
                return jsonify({'error': 'Instructor access required for grading'}), 403

            return jsonify({'error': 'Access denied'}), 403

        return decorated_function

    return decorator


def validate_file_upload(allowed_types=None, max_size=None, max_count=None):
    """
    Middleware to validate file uploads
    """

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            files = []

            # Collect files from request
            for key in request.files:
                file = request.files[key]
                if file and file.filename:
                    files.append(file)

            # Get files from getlist if present
            if 'files' in request.files:
                files.extend(request.files.getlist('files'))

            # Check file count
            if max_count and len(files) > max_count:
                return jsonify({'error': f'Maximum {max_count} files allowed'}), 400

            # Validate each file
            for file in files:
                if not file.filename:
                    continue

                # Check file size
                if max_size:
                    file.seek(0, 2)  # Seek to end
                    file_size = file.tell()
                    file.seek(0)  # Reset to beginning

                    if file_size > max_size:
                        return jsonify({
                            'error': f'File {file.filename} exceeds size limit of {max_size / (1024 * 1024):.1f}MB'
                        }), 400

                # Check file type
                if allowed_types:
                    file_ext = file.filename.rsplit('.', 1)[-1].lower()
                    if file_ext not in [t.lower() for t in allowed_types]:
                        return jsonify({
                            'error': f'File type .{file_ext} not allowed. Allowed: {", ".join(allowed_types)}'
                        }), 400

            return f(*args, **kwargs)

        return decorated_function

    return decorator


def require_enrollment_or_instructor(f):
    """Check if user is enrolled in course or is instructor"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        course_id = kwargs.get('course_id')
        if not course_id:
            return jsonify({'error': 'Course ID required'}), 400

        course = Course.find_instance_by_id(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404

        if not g.current_user:
            return jsonify({'error': 'Authentication required'}), 401

        user_id = str(g.current_user['_id'])
        user_role = g.current_user.get('role')

        # Check access
        if (user_role == 'admin' or
                str(course.instructor_id) == user_id or
                str(course.uploader_id) == user_id or
                user_id in [str(s) for s in course.enrolled_students]):
            return f(*args, **kwargs)

        return jsonify({'error': 'Must be enrolled in course or be instructor'}), 403

    return decorated_function


def check_assignment_deadline(f):
    """Check if assignment submission is within deadline"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        from datetime import datetime, timezone
        from app.models.assignment_model import Assignment

        assignment_id = kwargs.get('assignment_id')
        if not assignment_id:
            return jsonify({'error': 'Assignment ID required'}), 400

        try:
            assignment_doc = Assignment._coll().find_one({'_id': ObjectId(assignment_id)})
            if not assignment_doc:
                return jsonify({'error': 'Assignment not found'}), 404

            assignment = Assignment(assignment_doc)

            # Check if assignment is published
            if not assignment.is_published:
                return jsonify({'error': 'Assignment not yet published'}), 403

            # Check deadline
            if assignment.due_date:
                now = datetime.now(timezone.utc)
                if now > assignment.due_date and not assignment.allow_late_submission:
                    return jsonify({'error': 'Assignment deadline has passed'}), 403

            return f(*args, **kwargs)

        except Exception as e:
            return jsonify({'error': f'Error checking assignment: {str(e)}'}), 500

    return decorated_function


def require_course_published(f):
    """Check if course is published (for student access)"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        course_id = kwargs.get('course_id')
        if not course_id:
            return jsonify({'error': 'Course ID required'}), 400

        course = Course.find_instance_by_id(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404

        # Allow instructors and admins to access unpublished courses
        if g.current_user:
            user_id = str(g.current_user['_id'])
            user_role = g.current_user.get('role')

            if (user_role == 'admin' or
                    str(course.instructor_id) == user_id or
                    str(course.uploader_id) == user_id):
                return f(*args, **kwargs)

        # For students, check if course has published content
        # This would depend on your course publishing logic
        # For now, we'll assume courses are always accessible
        return f(*args, **kwargs)

    return decorated_function
